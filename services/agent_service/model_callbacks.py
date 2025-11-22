"""Model callbacks for handling artifact uploads to GCS"""
import logging
import hashlib
import os
from typing import List
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmResponse, LlmRequest
from google.genai.types import Part
from google.cloud import storage

logger = logging.getLogger(__name__)

GCP_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "veris-478615")
GOOGLE_CLOUD_BUCKET = os.getenv("GOOGLE_CLOUD_BUCKET", "veris-media")


async def before_model_modifier(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> LlmResponse | None:
    """Modify LLM request to include artifact references and upload to GCS."""
    for content in llm_request.contents:
        if not content.parts:
            continue

        modified_parts = []
        for part in content.parts:
            # Handle user-uploaded inline images/videos
            if part.inline_data:
                processed_parts = await _process_inline_data_part(
                    part, callback_context
                )
            else:
                processed_parts = [part]

            modified_parts.extend(processed_parts)

        content.parts = modified_parts


async def _process_inline_data_part(
    part: Part, callback_context: CallbackContext
) -> List[Part]:
    """Process inline data parts (user-uploaded images/videos).
    
    1. Saves as artifact in ADK (for claim_extraction_agent to access)
    2. Uploads to GCS (for database storage)
    3. Returns parts with artifact marker and GCS URL
    """
    artifact_id = _generate_artifact_id(part)

    # Save artifact if it doesn't exist
    if artifact_id not in await callback_context.list_artifacts():
        await callback_context.save_artifact(filename=artifact_id, artifact=part)
        logger.info(f"💾 Saved artifact: {artifact_id}")

    # Upload to GCS for permanent storage
    gcs_url = await _upload_to_gcs(part, artifact_id)

    return [
        Part(
            text=f"[User Uploaded Media] Artifact ID: {artifact_id} | GCS URL: {gcs_url}\n\nNote: Use load_artifacts() to access the media file for analysis. Use GCS URL for database storage."
        ),
        part,
    ]


async def _upload_to_gcs(part: Part, artifact_id: str) -> str:
    """Upload artifact to Google Cloud Storage and return public URL."""
    try:
        if not GCP_PROJECT:
            logger.warning("⚠️ GOOGLE_CLOUD_PROJECT not set, skipping GCS upload")
            return f"artifact://{artifact_id}"

        # Initialize GCS client
        storage_client = storage.Client(project=GCP_PROJECT)
        bucket = storage_client.bucket(GOOGLE_CLOUD_BUCKET)
        
        # Determine folder based on mime type
        mime_type = part.inline_data.mime_type
        if mime_type.startswith("image/"):
            folder = "images"
        elif mime_type.startswith("video/"):
            folder = "videos"
        else:
            folder = "media"
        
        blob_path = f"{folder}/{artifact_id}"
        blob = bucket.blob(blob_path)

        # Upload
        image_data = part.inline_data.data
        blob.upload_from_string(image_data, content_type=mime_type)
        blob.make_public()

        public_url = blob.public_url
        logger.info(f"Uploaded to GCS: {public_url}")

        return public_url

    except Exception as e:
        logger.error(f"GCS upload failed: {e}")
        return f"artifact://{artifact_id}"


def _generate_artifact_id(part: Part) -> str:
    """Generate a unique artifact ID for user uploaded media.
    
    Returns:
        Hash-based artifact ID with proper file extension.
    """
    filename = part.inline_data.display_name or "uploaded_media"
    media_data = part.inline_data.data

    # Combine filename and data for hash
    hash_input = filename.encode("utf-8") + media_data
    content_hash = hashlib.sha256(hash_input).hexdigest()[:16]

    # Extract file extension from mime type
    mime_type = part.inline_data.mime_type
    extension = mime_type.split("/")[-1]

    return f"veris_media_{content_hash}.{extension}"

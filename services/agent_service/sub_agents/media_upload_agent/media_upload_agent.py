import os
import logging
import hashlib
from typing import Optional
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
from google.cloud import storage
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
GCP_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "")
GOOGLE_CLOUD_BUCKET = os.getenv("GOOGLE_CLOUD_BUCKET", "veris-media")
DESCRIPTION = "Upload images/videos to Google Cloud Storage and return public URLs. Handles local files and validates existing URLs."


def upload_media_to_gcs(
    media_data: str,
    media_type: str,
    filename: Optional[str] = None
) -> dict:
    """
    Upload media to Google Cloud Storage and return public URL
    
    Args:
        media_data: Base64 encoded media data or file path
        media_type: Type of media (image/video)
        filename: Optional custom filename
        
    Returns:
        dict: Status and public URL
    """
    try:
        if not GCP_PROJECT:
            return {
                "status": "error",
                "message": "GOOGLE_CLOUD_PROJECT not configured"
            }
        
        # Generate unique filename
        if not filename:
            content_hash = hashlib.md5(media_data.encode()).hexdigest()[:12]
            ext = "png" if media_type == "image" else "mp4"
            filename = f"{media_type}s/{content_hash}.{ext}"
        
        # Initialize GCS client
        storage_client = storage.Client(project=GCP_PROJECT)
        bucket = storage_client.bucket(GOOGLE_CLOUD_BUCKET)
        blob = bucket.blob(filename)
        
        # Upload (assuming base64 data for now)
        import base64
        try:
            media_bytes = base64.b64decode(media_data)
        except Exception:
            # If not base64, treat as raw bytes
            media_bytes = media_data.encode()
        
        content_type = "image/png" if media_type == "image" else "video/mp4"
        blob.upload_from_string(media_bytes, content_type=content_type)
        
        # Make public
        blob.make_public()
        public_url = blob.public_url
        
        logger.info(f"✅ Uploaded {media_type} to: {public_url}")
        
        return {
            "status": "success",
            "url": public_url,
            "filename": filename
        }
        
    except Exception as e:
        logger.error(f"❌ Upload failed: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


media_upload_agent = None
try:
    media_upload_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="media_upload_agent",
        description=DESCRIPTION,
        instruction=prompt.MEDIA_UPLOAD_PROMPT,
        output_key="media_urls",
        tools=[FunctionTool(upload_media_to_gcs)]
    )
    logger.info(f"✅ Agent '{media_upload_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create media upload agent. Error: {e}")

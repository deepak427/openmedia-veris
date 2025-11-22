import logging
import os
import json
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
from . import prompt
from ...database import save_verified_claim

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
DESCRIPTION = "Save verified claims to database with full context (verification results + original content metadata). Maps verification output to database schema."


from typing import Optional

def save_claim_to_database(
    source: str,
    url: str,
    content_type: str,
    claim: str,
    category: str,
    verification_status: str,
    confidence: int,
    evidence: str,
    sources: str,
    media_references: str = "[]",
    raw_text: Optional[str] = None,
    images: str = "[]",
    videos: str = "[]",
    metadata: str = "{}"
) -> dict:
    """
    Save verified claim to Neon database with full context
    
    Args:
        source: Original content source name (e.g., "BBC News", "User Upload")
        url: Original source URL (article link, social media URL, or "user_upload")
        content_type: Type of content (text|image|video) - NEVER mixed
        claim: The verified claim text
        category: Claim category (health|politics|science|technology|finance|general)
        verification_status: Verification result (verified|false|partially_true|unverifiable|disputed)
        confidence: Confidence score (0-100)
        evidence: Summary of evidence found during verification
        sources: Verification source URLs as JSON string array
        media_references: Media references as JSON string array
        raw_text: Original article text (only for text content)
        images: Image URL as JSON array (GCS URL for uploaded, e.g., '["https://storage.googleapis.com/..."]')
        videos: Video URL as JSON array (GCS URL for uploaded, e.g., '["https://storage.googleapis.com/..."]')
        metadata: Original content metadata as JSON object (optional)
        
    Returns:
        dict: Success status with message and claim_id
        
    Note:
        - url: Source/origin ("user_upload" for uploaded media, article URL for text)
        - images/videos: Actual media URLs (GCS URLs for uploaded files)
    """
    try:
        # Parse JSON strings
        sources_list = json.loads(sources) if isinstance(sources, str) else sources or []
        media_list = json.loads(media_references) if isinstance(media_references, str) else media_references or []
        images_list = json.loads(images) if isinstance(images, str) else images or []
        videos_list = json.loads(videos) if isinstance(videos, str) else videos or []
        metadata_dict = json.loads(metadata) if isinstance(metadata, str) else metadata or {}
        
        logger.info(f"💾 Saving claim: {claim[:50]}... | {category} | {verification_status}")
        
        result = save_verified_claim(
            source=source,
            url=url,
            content_type=content_type,
            claim=claim,
            category=category,
            verification_status=verification_status,
            confidence=confidence,
            evidence=evidence,
            sources=sources_list,
            media_references=media_list,
            raw_text=raw_text,
            images=images_list,
            videos=videos_list,
            metadata=metadata_dict
        )
        
        if result.get("success"):
            logger.info(f"✅ Saved claim ID: {result.get('claim_id')}")
        else:
            logger.error(f"❌ Save failed: {result.get('message')}")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Exception saving claim: {e}")
        return {"success": False, "message": str(e)}


save_verified_claim_agent = None
try:
    save_verified_claim_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="save_verified_claim_agent",
        description=DESCRIPTION,
        instruction=prompt.SAVE_CLAIM_PROMPT,
        output_key="save_result",
        tools=[FunctionTool(save_claim_to_database)]
    )
    logger.info(f"✅ Agent '{save_verified_claim_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create save verified claim agent. Error: {e}")
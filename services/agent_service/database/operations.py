"""Database operations for saving verified claims"""
import json
import hashlib
import logging
from datetime import datetime
from typing import List, Dict, Any
from .client import db_client

logger = logging.getLogger(__name__)


def escape_sql(value: str) -> str:
    """Escape single quotes for SQL"""
    return value.replace("'", "''") if value else ""


def save_verified_claim(
    source: str,
    url: str,
    content_type: str,
    claim: str,
    category: str,
    verification_status: str,
    confidence: int,
    evidence: str,
    sources: List[str],
    media_references: List[Dict[str, Any]] = None,
    raw_text: str = None,
    images: List[str] = None,
    videos: List[str] = None,
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Save verified claim to database with full context
    
    Args:
        source: Original content source name (e.g., "BBC News", "User Upload")
        url: Original source URL (article link, social media URL, or "user_upload" for uploaded files)
        content_type: Type of content (text|image|video) - NEVER mixed
        claim: The claim text
        category: Claim category
        verification_status: Verification result
        confidence: Confidence score (0-100)
        evidence: Evidence summary
        sources: List of source URLs used for verification
        media_references: Media references from verification
        raw_text: Original article text (only for content_type=text)
        images: Image URL list (GCS URLs for uploaded images, or original URLs)
        videos: Video URL list (GCS URLs for uploaded videos, or original URLs)
        metadata: Original content metadata (title, author, date, etc.)
        
    Returns:
        dict: Success status and message
        
    Note:
        - url: Source/origin of content (article link or "user_upload")
        - images/videos: Actual media URLs (GCS URLs for uploaded, original URLs for linked)
    """
    try:
        claim_id = hashlib.md5(f"{url}_{claim}".encode()).hexdigest()[:32]
        
        # Prepare JSON fields
        sources_json = json.dumps(sources) if sources else '[]'
        media_json = json.dumps(media_references) if media_references else '[]'
        images_json = json.dumps(images) if images else '[]'
        videos_json = json.dumps(videos) if videos else '[]'
        metadata_json = json.dumps(metadata) if metadata else '{}'
        
        # Build SQL with all fields
        sql = f"""
            INSERT INTO crawled_content (
                id, source, url, content_type, claim, category,
                verification_status, confidence, evidence, verification_sources,
                media_references, raw_text, images, videos, metadata,
                created_at, updated_at
            ) VALUES (
                '{escape_sql(claim_id)}',
                '{escape_sql(source)}',
                '{escape_sql(url)}',
                '{escape_sql(content_type)}',
                '{escape_sql(claim)}',
                '{escape_sql(category)}',
                '{escape_sql(verification_status)}',
                {confidence},
                '{escape_sql(evidence)}',
                '{sources_json}'::jsonb,
                '{media_json}'::jsonb,
                {f"'{escape_sql(raw_text)}'" if raw_text else 'NULL'},
                '{images_json}'::jsonb,
                '{videos_json}'::jsonb,
                '{metadata_json}'::jsonb,
                '{datetime.utcnow().isoformat()}',
                '{datetime.utcnow().isoformat()}'
            )
            ON CONFLICT (url, claim) DO UPDATE SET
                verification_status = EXCLUDED.verification_status,
                confidence = EXCLUDED.confidence,
                evidence = EXCLUDED.evidence,
                verification_sources = EXCLUDED.verification_sources,
                media_references = EXCLUDED.media_references,
                raw_text = COALESCE(EXCLUDED.raw_text, crawled_content.raw_text),
                images = COALESCE(EXCLUDED.images, crawled_content.images),
                videos = COALESCE(EXCLUDED.videos, crawled_content.videos),
                metadata = COALESCE(EXCLUDED.metadata, crawled_content.metadata),
                updated_at = EXCLUDED.updated_at
        """
        
        result = db_client.query(sql)
        
        if "error" in result:
            logger.error(f"Database error: {result['error']}")
            return {
                "success": False,
                "message": f"Failed to save: {result['error']}"
            }
        
        logger.info(f"✅ Saved claim: {claim[:50]}...")
        return {
            "success": True,
            "message": "Claim saved successfully",
            "claim_id": claim_id
        }
        
    except Exception as e:
        logger.error(f"Error saving claim: {e}")
        return {
            "success": False,
            "message": f"Exception: {str(e)}"
        }

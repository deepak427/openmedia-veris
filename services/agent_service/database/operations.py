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
    sources: List[str]
) -> Dict[str, Any]:
    """
    Save verified claim to database
    
    Args:
        source: Original content source name
        url: Original content URL
        content_type: Type of content (text/image/video/mixed)
        claim: The claim text
        category: Claim category
        verification_status: Verification result
        confidence: Confidence score (0-100)
        evidence: Evidence summary
        sources: List of source URLs
        
    Returns:
        dict: Success status and message
    """
    try:
        claim_id = hashlib.md5(f"{url}_{claim}".encode()).hexdigest()[:32]
        
        sql = f"""
            INSERT INTO crawled_content (
                id, source, url, content_type, claim, category,
                verification_status, confidence, evidence, verification_sources,
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
                '{json.dumps(sources)}'::jsonb,
                '{datetime.utcnow().isoformat()}',
                '{datetime.utcnow().isoformat()}'
            )
            ON CONFLICT (url, claim) DO UPDATE SET
                verification_status = EXCLUDED.verification_status,
                confidence = EXCLUDED.confidence,
                evidence = EXCLUDED.evidence,
                verification_sources = EXCLUDED.verification_sources,
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

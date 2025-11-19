import logging
import os
import json
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
from . import prompt
from ...database import save_verified_claim

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
DESCRIPTION = "The DB-only worker that MUST call save_claim_to_database. (Minimal LLM reasoning required.)"


def save_claim_to_database(
    source: str,
    url: str,
    content_type: str,
    claim: str,
    category: str,
    verification_status: str,
    confidence: int,
    evidence: str,
    sources: str
) -> dict:
    """
    Save verified claim to Neon database with all details
    
    Args:
        source: Original content source name (e.g., "BBC News", "Twitter")
        url: Original content URL
        content_type: Type of content (text/image/video/mixed)
        claim: The verified claim text
        category: Claim category (health/politics/science/technology/finance/general)
        verification_status: Verification result (verified/false/partially_true/unverifiable/disputed)
        confidence: Confidence score (0-100)
        evidence: Summary of evidence found during verification
        sources: Source URLs as JSON string array (e.g., '["url1", "url2"]')
        
    Returns:
        dict: Success status with message and claim_id
    """
    try:
        # Convert sources to list if it's a JSON string
        if isinstance(sources, str):
            try:
                sources_list = json.loads(sources)
            except json.JSONDecodeError:
                # If not valid JSON, treat as single URL
                sources_list = [sources] if sources else []
        else:
            sources_list = sources if sources else []
        
        # Ensure sources is a list
        if not isinstance(sources_list, list):
            sources_list = [str(sources_list)]
        
        # Log the save attempt
        logger.info(f"💾 Attempting to save claim: {claim[:50]}...")
        logger.info(f"   Source: {source}")
        logger.info(f"   Category: {category}")
        logger.info(f"   Status: {verification_status}")
        logger.info(f"   Confidence: {confidence}")
        
        # Call the database save function
        result = save_verified_claim(
            source=source,
            url=url,
            content_type=content_type,
            claim=claim,
            category=category,
            verification_status=verification_status,
            confidence=confidence,
            evidence=evidence,
            sources=sources_list
        )
        
        # Log the result
        if result.get("success"):
            logger.info(f"✅ Successfully saved claim to database!")
            logger.info(f"   Claim ID: {result.get('claim_id')}")
        else:
            logger.error(f"❌ Failed to save claim: {result.get('message')}")
        
        return result
        
    except Exception as e:
        error_msg = f"Exception while saving claim: {str(e)}"
        logger.error(f"❌ {error_msg}")
        return {
            "success": False,
            "message": error_msg
        }


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
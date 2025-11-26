import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_MEDIUM", "gemini-2.5-pro")
DESCRIPTION = "Extract atomic, verifiable claims from URL-based content (images, videos, articles). Uses google_search to fetch and analyze content from URLs."

url_claim_extraction_agent = None
try:
    url_claim_extraction_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="url_claim_extraction_agent",
        description=DESCRIPTION,
        instruction=prompt.URL_CLAIM_EXTRACTION_PROMPT,
        tools=[google_search],
        output_key="extracted_claims",
    )
    logger.info(f"✅ Agent '{url_claim_extraction_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create URL claim extraction agent. Error: {e}")

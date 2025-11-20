import logging
import os
from google.adk.agents import LlmAgent
from . import prompt

# Set logging
logger = logging.getLogger(__name__)

# Configuration constants
GEMINI_MODEL = os.getenv("GEMINI_MODEL_MEDIUM", "gemini-2.5-pro")
DESCRIPTION = "Extract atomic, verifiable, public-interest claims from text or media URLs (image/video). Analyzes content at provided URLs, filters trivial statements, rewrites claims as standalone facts."

# --- Claim Extraction Agent ---
claim_extraction_agent = None
try:
    claim_extraction_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="claim_extraction_agent",
        description=DESCRIPTION,
        instruction=prompt.CLAIM_EXTRACTION_PROMPT,
        output_key="extracted_claims",
    )
    logger.info(f"✅ Agent '{claim_extraction_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(
        f"❌ Could not create claim extraction agent. Check API Key ({GEMINI_MODEL}). Error: {e}"
    )
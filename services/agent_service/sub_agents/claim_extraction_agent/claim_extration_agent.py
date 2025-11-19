import logging
import os
from google.adk.agents import LlmAgent
from . import prompt

# Set logging
logger = logging.getLogger(__name__)

# Configuration constants
GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
DESCRIPTION = "find ALL atomic, verifiable factual claims in the content (text/images/videos/mixed). Extraction must be high-recall, atomicization of multi-part statements."

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
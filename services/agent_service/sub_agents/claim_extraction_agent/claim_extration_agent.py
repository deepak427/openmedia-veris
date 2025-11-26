import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools import load_artifacts
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_MEDIUM", "gemini-2.5-pro")
DESCRIPTION = "Extract atomic, verifiable claims from text or uploaded media. Uses load_artifacts to access uploaded images/videos."

claim_extraction_agent = None
try:
    claim_extraction_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="claim_extraction_agent",
        description=DESCRIPTION,
        instruction=prompt.CLAIM_EXTRACTION_PROMPT,
        tools=[load_artifacts],
        output_key="extracted_claims",
    )
    logger.info(f"✅ Agent '{claim_extraction_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create claim extraction agent. Error: {e}")
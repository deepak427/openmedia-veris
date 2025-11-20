import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from . import prompt
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_LATEST", "gemini-3-pro-preview")
DESCRIPTION = "Verify claims using tiered source strategy (gov/academic → trusted media → experts). Returns verdict, confidence, evidence summary, and source URLs."

verify_claim_agent = None
try:
    verify_claim_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="verify_claim_agent",
        description=DESCRIPTION,
        instruction=prompt.VERIFY_CLAIM_PROMPT,
        output_key="verification_result",
        tools=[google_search]
    )
    logger.info(f"✅ Agent '{verify_claim_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create verify claim agent. Error: {e}")
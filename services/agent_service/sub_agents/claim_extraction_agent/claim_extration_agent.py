import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools import load_artifacts, googlesearch 
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_MEDIUM", "gemini-2.5-pro")

# Updated description to reflect all capabilities (Text, Media, URL)
DESCRIPTION = "Extract atomic, verifiable claims from text, embedded images (artifacts), or web URLs. Uses vision for media and search tools for URLs."

claim_extraction_agent = LlmAgent(
    model=GEMINI_MODEL,
    name="claim_extraction_agent",
    description=DESCRIPTION,
    instruction=prompt.CLAIM_EXTRACTION_PROMPT,
    # Now it has EYES (load_artifacts) and a BROWSER (googlesearch)
    tools=[load_artifacts, googlesearch], 
    output_key="extracted_claims",
)
import logging
import os
from google.adk.agents import LlmAgent
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
DESCRIPTION = "Analyzes text, images, and videos to extract claims and understand content"

# Create the content analyzer agent - Gemini handles everything
content_analyzer_agent = None
try:
    content_analyzer_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="content_analyzer_agent",
        description=DESCRIPTION,
        instruction=prompt.CONTENT_ANALYZER_PROMPT,
        output_key="content_analysis"
    )
    logger.info(f"✅ Agent '{content_analyzer_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create content analyzer agent. Error: {e}")

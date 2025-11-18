import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from . import prompt

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
DESCRIPTION = "Verifies claims using Google search and reliable sources"

# Create the fact checker agent - uses built-in Google Search tool
fact_checker_agent = None
try:
    fact_checker_agent = LlmAgent(
        model=GEMINI_MODEL,
        name="fact_checker_agent",
        description=DESCRIPTION,
        instruction=prompt.FACT_CHECKER_PROMPT,
        output_key="fact_check",
        tools=[google_search]
    )
    logger.info(f"✅ Agent '{fact_checker_agent.name}' created using model '{GEMINI_MODEL}'.")
except Exception as e:
    logger.error(f"❌ Could not create fact checker agent. Error: {e}")

import logging
import os

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.content_analyzer_agent.content_analyzer_agent import content_analyzer_agent
from .sub_agents.fact_checker_agent.fact_checker_agent import fact_checker_agent

# Set logging
logger = logging.getLogger(__name__)

# Configuration constants
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
DESCRIPTION = "Intelligent content verification assistant that analyzes text, images, and videos to extract claims and verify them against reliable sources"

# --- Veris Agent (root agent) ---

if content_analyzer_agent and fact_checker_agent:
    root_agent = LlmAgent(
        name="Veris",
        model=GEMINI_MODEL, 
        description=DESCRIPTION,
        instruction=prompt.VERIS_AGENT_PROMPT,
        tools=[
            AgentTool(content_analyzer_agent),
            AgentTool(fact_checker_agent)
        ],
    )
    logger.info(f"✅ Agent '{root_agent.name}' created using model '{GEMINI_MODEL}'.")
else:
    logger.error(
        "❌ Cannot create root agent because one or more sub-agents failed to initialize."
    )
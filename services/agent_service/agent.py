import logging
import os
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from . import prompt
from .sub_agents.claim_extraction_agent.claim_extration_agent import claim_extraction_agent
from .sub_agents.verify_claim_agent.verify_claim_agent import verify_claim_agent
from .sub_agents.save_verified_claim_agent.save_verified_claim_agent import save_verified_claim_agent
from .database import db_client

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
DESCRIPTION = "receive content → call extractor → iterate verification per claim → call save agent → produce summary."


def initialize_database():
    """Initialize database connection"""
    try:
        project_id = os.getenv("NEON_PROJECT_ID", "")
        database_name = os.getenv("NEON_DATABASE_NAME", "neondb")
        
        if not project_id:
            logger.error("❌ NEON_PROJECT_ID required")
            return False
        
        db_client.connect(project_id, database_name)
        logger.info(f"✅ Database connected: {database_name}")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False

root_agent = None

if claim_extraction_agent and verify_claim_agent and save_verified_claim_agent:
    db_initialized = initialize_database()
    
    if db_initialized:
        root_agent = LlmAgent(
            name="Veris",
            model=GEMINI_MODEL, 
            description=DESCRIPTION,
            instruction=prompt.VERIS_AGENT_PROMPT,
            tools=[
                AgentTool(claim_extraction_agent), 
                AgentTool(verify_claim_agent),
                AgentTool(save_verified_claim_agent)
            ],
        )
        logger.info(f"✅ Root agent 'Veris' created using model '{GEMINI_MODEL}'.")
    else:
        logger.error("❌ Cannot create root agent: Database initialization failed")
else:
    logger.error("❌ Cannot create root agent: Sub-agents failed to initialize")
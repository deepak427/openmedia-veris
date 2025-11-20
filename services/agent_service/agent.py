import logging
import os
import hashlib
import base64
from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools import FunctionTool
from google.cloud import storage
from . import prompt
from .sub_agents.claim_extraction_agent.claim_extration_agent import claim_extraction_agent
from .sub_agents.verify_claim_agent.verify_claim_agent import verify_claim_agent
from .sub_agents.save_verified_claim_agent.save_verified_claim_agent import save_verified_claim_agent
from .database import db_client

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL_ROOT", "gemini-2.5-flash")
GCP_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "")
GOOGLE_CLOUD_BUCKET = os.getenv("GOOGLE_CLOUD_BUCKET", "veris-media")
DESCRIPTION = "Orchestrate fact-checking pipeline: upload media → extract claims → verify → save. Handles text/image/video content."


def upload_image_to_gcs(image_data: str) -> dict:
    """
    Upload image to Google Cloud Storage and return public URL
    
    Args:
        image_data: Base64 encoded image data
        
    Returns:
        dict: Status and public URL
    """
    try:
        if not GCP_PROJECT:
            logger.warning("⚠️ GOOGLE_CLOUD_PROJECT not set, skipping upload")
            return {
                "status": "skipped",
                "url": "embedded_image_placeholder",
                "message": "GCP not configured"
            }
        
        # Generate unique filename
        content_hash = hashlib.md5(image_data.encode()).hexdigest()[:12]
        filename = f"images/{content_hash}.png"
        
        # Initialize GCS client
        storage_client = storage.Client(project=GCP_PROJECT)
        bucket = storage_client.bucket(GOOGLE_CLOUD_BUCKET)
        blob = bucket.blob(filename)
        
        # Decode and upload
        try:
            image_bytes = base64.b64decode(image_data)
        except Exception:
            image_bytes = image_data.encode()
        
        blob.upload_from_string(image_bytes, content_type="image/png")
        blob.make_public()
        
        public_url = blob.public_url
        logger.info(f"✅ Uploaded image to: {public_url}")
        
        return {
            "status": "success",
            "url": public_url
        }
        
    except Exception as e:
        logger.error(f"❌ Upload failed: {e}")
        return {
            "status": "error",
            "url": "embedded_image_placeholder",
            "message": str(e)
        }


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
                FunctionTool(upload_image_to_gcs),
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
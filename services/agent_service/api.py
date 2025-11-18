"""
FastAPI wrapper for Veris Agent Service
Provides HTTP API for content analysis and verification
"""
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from agent import root_agent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Veris Agent Service",
    description="AI-powered content verification and fact-checking API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ContentRequest(BaseModel):
    content_type: str  # text, image, video, mixed
    text: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    metadata: Optional[dict] = None

class ClaimResult(BaseModel):
    claim: str
    category: str
    confidence: float
    verification_status: str
    evidence: List[str]
    sources: List[str]

class AnalysisResponse(BaseModel):
    content_summary: str
    extracted_claims: List[ClaimResult]
    overall_assessment: str
    metadata: dict

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Veris Agent Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "agent_available": root_agent is not None
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_content(request: ContentRequest):
    """
    Analyze and verify content
    
    Args:
        request: ContentRequest with content to analyze
        
    Returns:
        AnalysisResponse with verification results
    """
    try:
        logger.info(f"Analyzing content: type={request.content_type}")
        
        # Validate request
        if not request.text and not request.image_url and not request.video_url:
            raise HTTPException(
                status_code=400,
                detail="At least one of text, image_url, or video_url must be provided"
            )
        
        # Run agent
        result = root_agent.run({
            "content_type": request.content_type,
            "text": request.text,
            "image_url": request.image_url,
            "video_url": request.video_url,
            "metadata": request.metadata or {}
        })
        
        logger.info("Analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.post("/verify-claim")
async def verify_single_claim(claim: str, category: str = "general"):
    """
    Verify a single claim
    
    Args:
        claim: The claim to verify
        category: Category of the claim
        
    Returns:
        Verification result
    """
    try:
        logger.info(f"Verifying claim: {claim[:50]}...")
        
        result = root_agent.run({
            "content_type": "text",
            "text": claim,
            "metadata": {"category": category}
        })
        
        return result
        
    except Exception as e:
        logger.error(f"Verification error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Verification failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting Veris Agent Service API...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

# Veris Agent Service

AI fact-checking system using Google ADK that extracts, verifies, and stores claims.

## Architecture

**Root Agent (Veris)** orchestrates three sub-agents:
1. **Claim Extraction Agent** - Extracts verifiable claims from content
2. **Verify Claim Agent** - Fact-checks claims using Google Search
3. **Save Verified Claim Agent** - Stores verification results to database

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

```env
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_API_KEY=your_api_key
NEON_PROJECT_ID=your_project_id
NEON_DATABASE_NAME=neondb
DATABASE_URL=postgresql://user:pass@host/db
```

## Usage

```python
from agent_service import root_agent

content = {
    "source": "BBC News",
    "url": "https://example.com/article",
    "content_type": "text",
    "raw_text": "Your content here..."
}

result = root_agent.run(content)
```

## Database Schema

Saves to `crawled_content` table:
- `verification_status`: verified/false/partially_true/unverifiable/disputed
- `confidence`: 0-100 score
- `evidence`: Summary of findings
- `verification_sources`: JSONB array of source URLs

## Claim Categories

- health, politics, science, technology, finance, general

## Confidence Scores

- 90-100: Very strong evidence
- 70-89: Strong evidence
- 50-69: Moderate evidence
- 30-49: Weak evidence
- 0-29: Very weak evidence

## Project Structure

```
agent_service/
├── agent.py                           # Root agent
├── prompt.py                          # Root prompt
├── database/                          # Database module
│   ├── client.py                      # DB client
│   └── operations.py                  # DB operations
└── sub_agents/
    ├── claim_extraction_agent/
    ├── verify_claim_agent/
    └── save_verified_claim_agent/
```

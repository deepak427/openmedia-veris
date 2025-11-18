# Veris Agent Service

AI-powered content verification agent that analyzes and fact-checks information from text, images, and videos.

## Overview

The Veris Agent uses Google's Gemini AI to:
- Analyze content from multiple formats (text, images, videos)
- Extract verifiable claims and statements
- Verify information using Google Search
- Provide confidence scores and evidence

## Architecture

```
Veris Agent (Root)
├── Content Analyzer Agent
│   ├── analyze_text_content()
│   ├── analyze_image_content()
│   └── analyze_video_content()
└── Fact Checker Agent
    ├── search_google()
    └── verify_claim()
```

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **GOOGLE_SEARCH_API_KEY**: Get from [Google Cloud Console](https://console.cloud.google.com/)
- **GOOGLE_SEARCH_ENGINE_ID**: Create at [Programmable Search Engine](https://programmablesearchengine.google.com/)

### 3. Usage

```python
from agent_service.agent import root_agent

# Analyze and verify content
result = root_agent.run({
    "content_type": "text",
    "text": "Your content here",
    "image_url": "optional_image_url",
    "video_url": "optional_video_url"
})

print(result)
```

## Agent Capabilities

### Content Analyzer Agent

Extracts information from:
- **Text**: Claims, context, sentiment
- **Images**: Visual elements, OCR text, objects
- **Videos**: Transcription, key frames, speakers

### Fact Checker Agent

Verifies claims by:
- Searching Google for evidence
- Prioritizing reliable sources (.gov, .edu, established media)
- Cross-referencing multiple sources
- Providing confidence scores

## Output Format

```json
{
  "content_summary": "Brief summary",
  "extracted_claims": [
    {
      "claim": "Specific claim",
      "category": "health|politics|science|technology|general",
      "confidence": 0.85,
      "verification_status": "verified|false|unverified|misleading",
      "evidence": ["Evidence point 1", "Evidence point 2"],
      "sources": ["https://source1.com", "https://source2.com"]
    }
  ],
  "overall_assessment": "Summary of findings",
  "metadata": {
    "content_type": "text|image|video|mixed",
    "analysis_timestamp": "2024-01-01T00:00:00Z",
    "sources_checked": 5
  }
}
```

## Integration with Crawler Service

The agent service is designed to work with the crawler service:

```typescript
// In crawler service
import { analyzeContent } from './agents/claimExtractorAgent';

const result = await analyzeContent({
  text: crawledContent.text,
  images: crawledContent.images,
  videos: crawledContent.videos
});
```

## Development

### Adding New Tools

1. Create tool function in sub-agent file
2. Add to agent's tools list
3. Update prompt with tool description

### Testing

```bash
python -m pytest tests/
```

## API Keys Setup Guide

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and add to `.env`

### Google Search API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Custom Search API"
3. Create credentials (API Key)
4. Create a [Programmable Search Engine](https://programmablesearchengine.google.com/)
5. Get the Search Engine ID
6. Add both to `.env`

## License

MIT

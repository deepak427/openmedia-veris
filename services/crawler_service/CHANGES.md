# Crawler Service Refactoring

## What Changed

### Removed
- ❌ OpenAI integration (claim extraction)
- ❌ Database repository (storage)
- ❌ Reddit crawler
- ❌ `@veris/shared` dependency
- ❌ Local claim processing logic

### Added
- ✅ ADK Agent Client (sends to deployed agent)
- ✅ Simple in-memory URL tracking
- ✅ Cleaner, focused architecture

## New Architecture

**Before:**
```
RSS → Crawler → OpenAI → Database
```

**After:**
```
RSS → Crawler → ADK Agent → (Extract → Verify → Save)
```

## Benefits

1. **Separation of Concerns**: Crawler only crawls, agent handles AI logic
2. **Simpler Code**: Removed 200+ lines of database and AI code
3. **Centralized Processing**: All claim logic in one place (agent service)
4. **Easier Scaling**: Can scale crawler and agent independently
5. **No Duplicate Logic**: Single source of truth for claim processing

## Configuration Changes

### Old .env
```bash
NEON_PROJECT_ID=...
NEON_DATABASE_NAME=...
AI_API_KEY=...
AI_MODEL=...
RSS_FEEDS=...
```

### New .env
```bash
ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app
RSS_FEEDS=...
CRAWL_INTERVAL_MS=...
```

## Migration Steps

1. Update `.env` with `ADK_AGENT_URL`
2. Remove old database and AI config
3. Run `pnpm install` (removes unused deps)
4. Run `pnpm dev`

## How It Works Now

1. Crawler fetches RSS articles every 5 minutes
2. Extracts full article content
3. Formats as message for ADK agent
4. POSTs to ADK agent URL
5. ADK agent handles everything else:
   - Extract claims
   - Verify claims
   - Save to database

## Testing

Send a test article:
```bash
curl -X POST https://veris-ai-773695696004.us-central1.run.app \
  -H "Content-Type: application/json" \
  -d '{"message": "Article from BBC News\n\nTitle: Test\n\nContent: Some test content..."}'
```

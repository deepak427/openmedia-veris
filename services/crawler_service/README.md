# Veris Crawler Service

RSS feed crawler that sends articles to the ADK agent service for claim extraction, verification, and storage.

## Architecture

```
RSS Feeds → Crawler → ADK Agent Service → Database
```

The crawler:
1. Fetches articles from configured RSS feeds
2. Extracts full article content
3. Sends to ADK agent service for processing
4. Tracks processed URLs to avoid duplicates

The ADK agent service handles:
- Claim extraction
- Claim verification
- Database storage

## Configuration

Create `.env` file:

```bash
# ADK Agent Service URL (deployed Google ADK)
ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app

# Crawl interval (5 minutes = 300000ms)
CRAWL_INTERVAL_MS=300000

# RSS feeds (comma-separated)
RSS_FEEDS=https://feeds.bbci.co.uk/news/rss.xml,https://timesofindia.indiatimes.com/rssfeedstopstories.cms
```

## Running

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## How It Works

1. **RSS Crawling**: Fetches articles from configured feeds
2. **Content Extraction**: Extracts full article text using Cheerio
3. **Deduplication**: Tracks processed URLs in memory
4. **ADK Integration**: Sends articles to ADK agent via HTTP POST
5. **Rate Limiting**: 2-second delay between requests

## Adding RSS Feeds

Add feeds to `.env`:

```bash
RSS_FEEDS=https://feed1.com/rss,https://feed2.com/rss,https://feed3.com/rss
```

## Monitoring

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only
- Console output

## Error Handling

- Individual feed failures don't stop the crawler
- Failed articles are logged but skipped
- Crawler continues on ADK agent errors
- Automatic retry on next cycle

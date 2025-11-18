# Veris

A production-ready monorepo for real-time content analysis and claim extraction.

## Project Structure

```
veris/
├── services/
│   └── crawler-service/          # Main crawler service
│       ├── src/
│       │   ├── crawlers/
│       │   │   ├── rssCrawler.ts      # RSS feed crawler
│       │   │   └── redditCrawler.ts   # Reddit crawler
│       │   ├── agents/
│       │   │   └── claimExtractorAgent.ts  # AI claim extraction
│       │   ├── db/
│       │   │   └── repository.ts      # Database operations
│       │   ├── utils/
│       │   │   └── logger.ts          # Logging utilities
│       │   ├── types.ts               # Type definitions
│       │   └── app.ts                 # Main application
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
├── packages/
│   └── shared/                   # Shared utilities
│       ├── src/
│       │   ├── dbClient.ts           # MCP database client
│       │   ├── types.ts              # Shared types
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── infrastructure/               # Infrastructure configs (future)
├── scripts/                      # Build/deploy scripts (future)
├── package.json                  # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace config
├── tsconfig.base.json           # Base TypeScript config
└── .gitignore

```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- uv (Python package manager for MCP server)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp services/crawler-service/.env.example services/crawler-service/.env

# Edit .env and add your AI_API_KEY
```

### Running the Service

```bash
# Development mode (with hot reload)
pnpm dev

# Build all packages
pnpm build

# Production mode
pnpm start
```

## Configuration

Edit `services/crawler-service/.env`:

```env
# Neon Database
NEON_PROJECT_ID=royal-glade-24471226
NEON_DATABASE_NAME=neondb

# AI Configuration
AI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4

# Crawler Settings
CRAWL_INTERVAL_MS=300000
RSS_FEEDS=https://feeds.bbci.co.uk/news/rss.xml,https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml

# Logging
LOG_LEVEL=info
```

## Architecture

### Data Flow

1. **Crawlers** (RSS + Reddit) → `RawContentItem[]`
2. **ClaimExtractorAgent** (AI) → `ProcessedContentItem[]`
3. **Repository** → Database storage via MCP

### Key Components

- **RSSCrawler**: Fetches and parses RSS feeds, extracts full article content
- **RedditCrawler**: Crawls Reddit posts from specified subreddits
- **ClaimExtractorAgent**: Uses AI to extract verifiable claims from content
- **Repository**: Manages database operations through MCP server
- **Logger**: Centralized structured logging with Winston

## Development

```bash
# Run specific service
pnpm --filter crawler-service dev

# Build specific package
pnpm --filter @veris/shared build

# Clean all builds
pnpm clean
```

## Database Schema

The project uses **Neon PostgreSQL** (serverless PostgreSQL):

```sql
CREATE TABLE crawled_content (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  raw_text TEXT,
  images JSONB,
  videos JSONB,
  metadata JSONB,
  claim TEXT,
  category TEXT,
  confidence REAL,
  extracted_from JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Neon Project**: `royal-glade-24471226` (Veris)
- Region: AWS US East 1
- PostgreSQL Version: 17
- Database: neondb

## License

MIT

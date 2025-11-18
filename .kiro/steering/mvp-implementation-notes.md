---
inclusion: always
---

# MVP Implementation Notes

## Database Implementation

The project uses **Neon PostgreSQL** via MCP server. This provides:
- Serverless PostgreSQL database
- Automatic scaling and branching
- Production-ready performance
- Built-in connection pooling
- JSONB support for flexible data

### Database Configuration

- **Project ID**: `royal-glade-24471226` (Veris project)
- **Database**: `neondb` (default)
- **Region**: AWS US East 1
- **PostgreSQL Version**: 17

### MCP Integration

The Neon MCP server is configured in `.kiro/settings/mcp.json` and provides:
- `mcp_neon_run_sql` - Execute SQL queries
- `mcp_neon_run_sql_transaction` - Execute transactions
- `mcp_neon_describe_table_schema` - Get table schema
- `mcp_neon_get_database_tables` - List all tables

## Environment Setup

Before running:
1. Copy `.env.example` to `.env`
2. Add your `AI_API_KEY` (OpenAI API key)
3. Verify `NEON_PROJECT_ID` is set correctly
4. Configure RSS feeds and crawl interval as needed

## Running the Service

```bash
# Install dependencies
pnpm install

# Build shared package first
pnpm --filter @veris/shared build

# Run in development
pnpm dev
```

## Architecture Decisions

### Why Neon PostgreSQL?
- Serverless architecture (no server management)
- Automatic scaling based on usage
- Database branching for development
- Production-ready from day one
- Better than SQLite for multi-user scenarios

### Why MCP Integration?
- Direct integration with Kiro
- No manual connection management
- Built-in query execution
- Schema introspection capabilities

### Why Monorepo?
- Shared types between services
- Easier dependency management
- Scalable for future services

### Why TypeScript Strict Mode?
- Catch errors at compile time
- Better IDE support
- Self-documenting code

## Code Quality Tools

- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Winston**: Structured logging

## PostgreSQL Features Used

- **JSONB columns**: For flexible metadata storage
- **ON CONFLICT**: For upsert operations
- **Indexes**: For query performance
- **Transactions**: For atomic operations

## Next Steps for Production

1. ✅ Database connection (implemented with Neon PostgreSQL)
2. Add rate limiting for API calls
3. Add retry logic with exponential backoff
4. Implement caching layer (Redis)
5. Add monitoring and alerting
6. Set up proper error tracking (Sentry, etc.)
7. Add comprehensive tests
8. Set up CI/CD pipeline
9. Add authentication/authorization
10. Implement API endpoints for querying claims
11. Use Neon branching for staging environments

---
inclusion: always
---

# Veris Project Standards

## Code Style

- Use TypeScript strict mode
- Prefer async/await over promises
- Use descriptive variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Error Handling

- Always use the `withErrorHandling` wrapper for async operations
- Log errors with context using structured logging
- Never swallow errors silently
- Return null on recoverable errors, throw on fatal errors

## Database Operations

- All database queries go through the Repository class
- Use parameterized queries to prevent SQL injection
- Always check if records exist before inserting
- Use transactions for batch operations

## AI Agent Guidelines

- Keep prompts concise and focused
- Always validate AI responses
- Set appropriate temperature (0.3 for factual extraction)
- Handle API rate limits gracefully
- Cache results when possible

## Logging

- Use structured logging with context
- Log levels: error, warn, info, debug
- Include relevant metadata in logs
- Never log sensitive information (API keys, PII)

## Testing

- Write unit tests for business logic
- Mock external dependencies (AI API, database)
- Test error handling paths
- Use integration tests for crawlers

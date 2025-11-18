---
inclusion: always
---

# Error Handling Guide

## General Principles

1. **Never swallow errors silently**
2. **Log errors with context**
3. **Return null for recoverable errors**
4. **Throw for fatal errors**
5. **Use type guards for error checking**

## Error Handling Patterns

### Async Operations

```typescript
// ✅ CORRECT - Use withErrorHandling wrapper
const result = await withErrorHandling(
  () => someAsyncOperation(),
  'Operation description'
);

if (result) {
  // Process result
}
```

### Try-Catch Blocks

```typescript
// ✅ CORRECT - Type the error
try {
  await operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error('Operation failed', {
      error: error.message,
      stack: error.stack,
    });
  } else {
    logger.error('Unknown error', { error: String(error) });
  }
}
```

### API Calls

```typescript
// ✅ CORRECT - Handle network errors
try {
  const response = await axios.get(url, { timeout: 10000 });
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      logger.error('API error', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // No response received
      logger.error('Network error', { url });
    }
  }
  return null;
}
```

### Database Operations

```typescript
// ✅ CORRECT - Check query results
const result = await dbClient.query(sql, params);

if (result.error) {
  logger.error('Database error', { error: result.error, sql });
  throw new Error(`Database operation failed: ${result.error}`);
}

return result.content;
```

## Logging Best Practices

### Log Levels

- **error**: Failures that need immediate attention
- **warn**: Potential issues or degraded functionality
- **info**: Important business events
- **debug**: Detailed diagnostic information

### Structured Logging

```typescript
// ✅ CORRECT - Include context
logger.info('Crawl completed', {
  source: 'RSS',
  itemsFound: 42,
  duration: 1234,
});

// ❌ WRONG - Plain strings
logger.info('Crawl completed with 42 items');
```

### Never Log Sensitive Data

```typescript
// ❌ WRONG - Exposes API key
logger.info('API call', { apiKey: process.env.API_KEY });

// ✅ CORRECT - Mask sensitive data
logger.info('API call', { apiKey: '***' });
```

## Error Recovery

### Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T | null> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        logger.error('Max retries reached', { error });
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return null;
}
```

### Graceful Degradation

```typescript
// ✅ CORRECT - Continue on partial failures
const results = [];
for (const item of items) {
  const result = await withErrorHandling(
    () => processItem(item),
    `Process item: ${item.id}`
  );
  if (result) {
    results.push(result);
  }
  // Continue processing other items even if one fails
}
```

## Validation

### Input Validation

```typescript
// ✅ CORRECT - Validate before processing
function processUrl(url: string): void {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL: must be a non-empty string');
  }
  
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
  
  // Process valid URL
}
```

### Type Guards

```typescript
// ✅ CORRECT - Use type guards
function isValidClaim(obj: unknown): obj is ProcessedContentItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'claim' in obj &&
    'category' in obj &&
    'confidence' in obj
  );
}
```

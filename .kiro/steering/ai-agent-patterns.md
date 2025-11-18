---
inclusion: fileMatch
fileMatchPattern: "**/agents/**/*.ts"
---

# AI Agent Development Patterns

## API Key Management

```typescript
// ✅ CORRECT - Load from environment
const apiKey = process.env.AI_API_KEY || '';

// ❌ WRONG - Never hardcode
const apiKey = 'sk-...';
```

## Prompt Engineering

### Structure
1. System message: Define role and output format
2. User message: Provide context + content + instruction

### Best Practices
- Be specific about output format (JSON, categories, etc.)
- Set appropriate temperature (0.0-0.3 for factual tasks)
- Limit input length to avoid token limits
- Always validate AI responses

### Example
```typescript
const systemPrompt = `You are a claim extraction expert.
Return JSON array: [{ claim: string, category: string, confidence: number }]
Categories: politics, health, science, economy, social, other`;

const userPrompt = `Extract verifiable claims from: ${content}`;
```

## Error Handling

- Handle rate limits with exponential backoff
- Validate JSON responses before parsing
- Set reasonable timeouts
- Log failed requests with context

## Cost Optimization

- Cache results for identical inputs
- Batch similar requests when possible
- Use cheaper models for simple tasks
- Truncate long content intelligently

## Response Validation

```typescript
// Always validate AI responses
const parsed = JSON.parse(aiResponse);
if (!Array.isArray(parsed.claims)) {
  throw new Error('Invalid AI response format');
}
```

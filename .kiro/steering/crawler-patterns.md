---
inclusion: fileMatch
fileMatchPattern: "**/crawlers/**/*.ts"
---

# Crawler Development Patterns

## Rate Limiting

Always respect source rate limits:

```typescript
// Add delays between requests
await new Promise(resolve => setTimeout(resolve, 1000));

// Use User-Agent headers
headers: {
  'User-Agent': 'Veris/1.0 (+contact@example.com)'
}
```

## Error Handling

Crawlers should be resilient:

```typescript
// ✅ Continue on individual failures
for (const url of urls) {
  const result = await withErrorHandling(
    () => this.crawlUrl(url),
    `Crawl: ${url}`
  );
  if (result) results.push(result);
}
```

## Content Extraction

### RSS Feeds
- Parse with `rss-parser`
- Extract full article content when possible
- Handle media attachments (images, videos)
- Preserve metadata (author, date, tags)

### HTML Scraping
- Use `cheerio` for parsing
- Remove unwanted elements (ads, nav, footer)
- Try multiple selectors for content
- Handle dynamic content limitations

### API-based Crawling
- Use official APIs when available
- Handle pagination properly
- Respect rate limits
- Cache responses

## Deduplication

Always check if content already exists:

```typescript
const exists = await repository.exists(url);
if (exists) continue;
```

## Timeout Configuration

```typescript
axios.get(url, {
  timeout: 10000, // 10 seconds
  maxRedirects: 5
});
```

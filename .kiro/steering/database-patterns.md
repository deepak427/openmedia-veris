---
inclusion: fileMatch
fileMatchPattern: "**/db/**/*.ts"
---

# Database Patterns and Best Practices

## Neon Database Client Usage

Always use the shared `dbClient` from `@veris/shared`:

```typescript
import { dbClient } from '@veris/shared';
```

## Connection Setup

```typescript
// Initialize with Neon project ID
const projectId = process.env.NEON_PROJECT_ID || '';
const databaseName = process.env.NEON_DATABASE_NAME || 'neondb';

await dbClient.connect(projectId, databaseName);
```

## Query Patterns

### SQL Escaping (REQUIRED)
Since Neon MCP doesn't support parameterized queries, use proper escaping:

```typescript
// ✅ CORRECT - Escape single quotes
const escapeSql = (value: string): string => value.replace(/'/g, "''");
const sql = `SELECT * FROM table WHERE name = '${escapeSql(userName)}'`;
await dbClient.query(sql);

// ❌ WRONG - Never concatenate without escaping
const sql = `SELECT * FROM table WHERE name = '${userName}'`;
```

### Error Handling
```typescript
await withErrorHandling(
  () => dbClient.query(sql),
  'Descriptive operation name'
);
```

### Transaction Support
```typescript
// Use transaction for multiple related operations
const sqlStatements = [
  'INSERT INTO table1 ...',
  'UPDATE table2 ...',
  'DELETE FROM table3 ...'
];

await dbClient.transaction(sqlStatements);
```

## PostgreSQL-Specific Features

### JSONB Columns
```typescript
// Store JSON data in JSONB columns
const sql = `
  INSERT INTO table (data) 
  VALUES ('${JSON.stringify(data)}'::jsonb)
`;
```

### ON CONFLICT (Upsert)
```typescript
// Use ON CONFLICT for upsert operations
const sql = `
  INSERT INTO table (id, name) 
  VALUES ('${id}', '${name}')
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
`;
```

## Connection Management

- Initialize once at application startup with project ID
- Reuse the same connection throughout the app lifecycle
- Always close connections on shutdown
- Handle connection errors gracefully

## Schema Migrations

- Use `CREATE TABLE IF NOT EXISTS` for MVP
- Add indexes for frequently queried columns
- Use PostgreSQL data types (TEXT, JSONB, TIMESTAMP, etc.)
- Document schema changes in comments

## Performance Tips

- Use JSONB for flexible JSON storage
- Add indexes on frequently queried columns
- Use ON CONFLICT for upserts instead of separate SELECT/INSERT
- Limit result sets with LIMIT clause
- Use transactions for batch operations

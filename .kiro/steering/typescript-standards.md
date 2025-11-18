---
inclusion: always
---

# TypeScript Standards

## Type Safety

- Enable strict mode in tsconfig.json
- Avoid `any` type - use `unknown` if needed
- Define interfaces for all data structures
- Use type guards for runtime validation

## Interface vs Type

```typescript
// ✅ Use interfaces for object shapes
interface User {
  id: string;
  name: string;
}

// ✅ Use types for unions, intersections
type Status = 'pending' | 'active' | 'inactive';
type UserWithStatus = User & { status: Status };
```

## Async/Await

```typescript
// ✅ CORRECT - Always use async/await
async function fetchData(): Promise<Data> {
  const result = await api.get('/data');
  return result.data;
}

// ❌ WRONG - Avoid raw promises
function fetchData(): Promise<Data> {
  return api.get('/data').then(r => r.data);
}
```

## Error Handling

```typescript
// ✅ Type errors properly
try {
  await operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  }
}
```

## Null Safety

```typescript
// ✅ Use optional chaining
const value = obj?.nested?.property;

// ✅ Use nullish coalescing
const result = value ?? defaultValue;
```

## Export Patterns

```typescript
// ✅ Named exports for utilities
export function helper() {}
export class Service {}

// ✅ Default export for main class
export default class App {}
```

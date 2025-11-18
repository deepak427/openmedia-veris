---
inclusion: always
---

# Minimal Code Principle - Write Less, Achieve More

## Core Philosophy

**Write the absolute minimum code needed to solve the problem.**

Every line of code is a liability:
- More code = More bugs
- More code = Harder maintenance
- More code = Slower development

## Rules

### 1. No Redundant Code
```typescript
// ❌ WRONG - Redundant wrapper
function getUserName(user: User): string {
  return user.name;
}

// ✅ CORRECT - Use directly
user.name
```

### 2. No Unnecessary Abstractions
```typescript
// ❌ WRONG - Over-abstraction
class UserNameGetter {
  constructor(private user: User) {}
  getName(): string {
    return this.user.name;
  }
}

// ✅ CORRECT - Direct access
user.name
```

### 3. No Premature Optimization
```typescript
// ❌ WRONG - Complex caching for simple case
const cache = new Map();
function getUser(id: string) {
  if (cache.has(id)) return cache.get(id);
  const user = db.getUser(id);
  cache.set(id, user);
  return user;
}

// ✅ CORRECT - Simple until proven slow
function getUser(id: string) {
  return db.getUser(id);
}
```

### 4. No Duplicate Documentation
```typescript
// ❌ WRONG - Redundant comments
/**
 * Gets the user name
 * @param user The user object
 * @returns The user's name
 */
function getUserName(user: User): string {
  return user.name;
}

// ✅ CORRECT - Self-documenting code
function getUserName(user: User): string {
  return user.name;
}
```

### 5. No Unused Code
- Delete commented-out code
- Remove unused imports
- Delete unused functions
- Remove dead branches

### 6. Reuse Before Writing
```typescript
// ❌ WRONG - Reimplementing
function isEmpty(arr: any[]): boolean {
  return arr.length === 0;
}

// ✅ CORRECT - Use built-in
arr.length === 0
```

## Documentation Rules

### Only Document When Necessary
- **Don't document**: What the code does (code should be self-explanatory)
- **Do document**: Why the code exists, complex algorithms, non-obvious decisions

```typescript
// ❌ WRONG - Obvious comment
// Loop through users
users.forEach(user => {
  // Send email to user
  sendEmail(user);
});

// ✅ CORRECT - Explain why
// Send welcome emails in batches to avoid rate limiting
users.forEach(user => sendEmail(user));
```

### Prefer Self-Documenting Code
```typescript
// ❌ WRONG - Needs comment
const x = u.filter(i => i.a > 18); // Get adult users

// ✅ CORRECT - Self-documenting
const adultUsers = users.filter(user => user.age > 18);
```

## File Organization

### One Purpose Per File
```
// ❌ WRONG - Everything in one file
utils.ts (5000 lines)

// ✅ CORRECT - Focused files
dateUtils.ts (50 lines)
stringUtils.ts (40 lines)
arrayUtils.ts (60 lines)
```

### No Redundant Files
- Don't create separate files for tiny utilities
- Combine related small functions
- Delete empty or near-empty files

## Function Rules

### Keep Functions Small
```typescript
// ❌ WRONG - Too long
function processUser(user: User) {
  // 100 lines of code
}

// ✅ CORRECT - Small, focused
function validateUser(user: User): boolean { /* ... */ }
function saveUser(user: User): void { /* ... */ }
function notifyUser(user: User): void { /* ... */ }
```

### Single Responsibility
Each function should do ONE thing well.

### Avoid Deep Nesting
```typescript
// ❌ WRONG - Deep nesting
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // Do something
    }
  }
}

// ✅ CORRECT - Early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
// Do something
```

## Type Definitions

### Reuse Types
```typescript
// ❌ WRONG - Duplicate types
interface UserData {
  name: string;
  email: string;
}
interface UserInfo {
  name: string;
  email: string;
}

// ✅ CORRECT - Single type
interface User {
  name: string;
  email: string;
}
```

### Use Type Inference
```typescript
// ❌ WRONG - Redundant type
const name: string = "John";

// ✅ CORRECT - Inferred
const name = "John";
```

## Testing

### Test Behavior, Not Implementation
```typescript
// ❌ WRONG - Testing implementation
expect(user.getName()).toBe(user.name);

// ✅ CORRECT - Testing behavior
expect(getUserDisplayName(user)).toBe("John Doe");
```

## Refactoring Checklist

Before committing, ask:
- [ ] Can I delete this code?
- [ ] Can I simplify this?
- [ ] Is this duplicated elsewhere?
- [ ] Does this need a comment?
- [ ] Can I use a built-in instead?
- [ ] Is this file necessary?
- [ ] Are all imports used?

## Examples

### Before (Verbose)
```typescript
class UserService {
  private users: User[] = [];

  constructor() {
    this.users = [];
  }

  public addUser(user: User): void {
    this.users.push(user);
    return;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserCount(): number {
    return this.users.length;
  }
}
```

### After (Minimal)
```typescript
class UserService {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }
}
// Use users.length directly instead of getUserCount()
```

## Remember

> "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry

**Write code that is:**
- Simple
- Clear
- Minimal
- Maintainable

**Avoid code that is:**
- Clever
- Complex
- Redundant
- Over-engineered

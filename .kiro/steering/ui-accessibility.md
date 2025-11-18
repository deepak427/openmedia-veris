---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,jsx,html}"
---

# Accessibility Guidelines - WCAG 2.1 AA Compliance

## Core Principles

### 1. Perceivable
Users must be able to perceive the information being presented.

### 2. Operable
Users must be able to operate the interface.

### 3. Understandable
Users must be able to understand the information and interface.

### 4. Robust
Content must be robust enough to work with assistive technologies.

## Color Contrast

### Minimum Ratios
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

### Testing
```tsx
// ✅ CORRECT - High contrast
<button style={{ background: '#2563eb', color: '#ffffff' }}>
  Click Me
</button>

// ❌ WRONG - Low contrast
<button style={{ background: '#93c5fd', color: '#ffffff' }}>
  Click Me
</button>
```

## Keyboard Navigation

### Tab Order
```tsx
// ✅ CORRECT - Logical tab order
<form>
  <input tabIndex={1} />
  <input tabIndex={2} />
  <button tabIndex={3}>Submit</button>
</form>
```

### Focus Management
```tsx
// ✅ CORRECT - Clear focus indicator
.button:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

// ❌ WRONG - No focus indicator
.button:focus {
  outline: none;
}
```

### Keyboard Shortcuts
```tsx
// ✅ CORRECT - Keyboard support
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
  if (e.key === 'Escape') {
    handleClose();
  }
};
```

## ARIA Labels

### Button Labels
```tsx
// ✅ CORRECT - Descriptive label
<button aria-label="Close dialog">
  <CloseIcon />
</button>

// ❌ WRONG - No label
<button>
  <CloseIcon />
</button>
```

### Form Labels
```tsx
// ✅ CORRECT - Associated label
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-helper"
/>
<span id="email-helper">We'll never share your email</span>
```

### Live Regions
```tsx
// ✅ CORRECT - Announce changes
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  {successMessage}
</div>
```

## Semantic HTML

### Use Proper Elements
```tsx
// ✅ CORRECT - Semantic HTML
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// ❌ WRONG - Divs for everything
<div className="nav">
  <div className="link">Home</div>
  <div className="link">About</div>
</div>
```

### Headings Hierarchy
```tsx
// ✅ CORRECT - Proper hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// ❌ WRONG - Skipping levels
<h1>Page Title</h1>
<h4>Section Title</h4>
```

## Images

### Alt Text
```tsx
// ✅ CORRECT - Descriptive alt text
<img
  src="/chart.png"
  alt="Bar chart showing 50% increase in sales"
/>

// ❌ WRONG - Generic alt text
<img src="/chart.png" alt="chart" />

// ✅ CORRECT - Decorative image
<img src="/decoration.png" alt="" role="presentation" />
```

## Forms

### Error Messages
```tsx
// ✅ CORRECT - Clear error indication
<input
  type="email"
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
)}
```

### Required Fields
```tsx
// ✅ CORRECT - Indicate required
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
<input id="name" required aria-required="true" />
```

## Screen Reader Support

### Skip Links
```tsx
// ✅ CORRECT - Skip to main content
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content">
  {/* Content */}
</main>
```

### Descriptive Links
```tsx
// ✅ CORRECT - Descriptive link text
<a href="/article">Read the full article about accessibility</a>

// ❌ WRONG - Generic link text
<a href="/article">Click here</a>
```

## Testing

### Tools
- axe DevTools (Chrome extension)
- WAVE (Web accessibility evaluation tool)
- Lighthouse (Chrome DevTools)
- NVDA/JAWS (Screen readers)

### Manual Testing
1. Navigate with keyboard only
2. Test with screen reader
3. Check color contrast
4. Verify focus indicators
5. Test form validation

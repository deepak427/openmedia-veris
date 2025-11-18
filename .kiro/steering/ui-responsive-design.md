---
inclusion: fileMatch
fileMatchPattern: "**/*.{css,scss,tsx,jsx}"
---

# Responsive Design - Mobile-First Approach

## Breakpoint System

### Standard Breakpoints
```css
/* Mobile: Default (< 640px) */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */

:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Mobile-First CSS

### Base Styles (Mobile)
```css
.container {
  padding: var(--space-4);
  font-size: var(--text-base);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
```

### Tablet Styles
```css
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}
```

### Desktop Styles
```css
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}
```

## Responsive Typography

### Fluid Font Sizes
```css
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
}
```

## Responsive Images

### Picture Element
```tsx
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet="/image-large.webp"
  />
  <source
    media="(min-width: 640px)"
    srcSet="/image-medium.webp"
  />
  <img
    src="/image-small.webp"
    alt="Description"
    loading="lazy"
  />
</picture>
```

## Touch-Friendly Design

### Minimum Touch Targets
```css
.button,
.link,
.interactive {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-4);
}
```

### Hover vs Touch
```css
/* Desktop hover effects */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
  }
}

/* Touch devices */
@media (hover: none) {
  .card:active {
    transform: scale(0.98);
  }
}
```

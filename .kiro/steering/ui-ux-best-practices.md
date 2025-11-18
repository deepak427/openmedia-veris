---
inclusion: always
---

# UI/UX Best Practices - Luxurious & Professional

## Design Principles

### 1. Visual Hierarchy
- Use size, color, and spacing to guide user attention
- Most important elements should be largest and most prominent
- Create clear focal points on each page

### 2. Consistency
- Use the same design patterns throughout the app
- Maintain consistent spacing, colors, and typography
- Follow established UI conventions

### 3. Simplicity
- Remove unnecessary elements
- Focus on core functionality
- Use white space effectively

### 4. Feedback
- Provide immediate visual feedback for user actions
- Use loading states, success messages, and error handling
- Animate state changes smoothly

### 5. Accessibility
- Ensure WCAG 2.1 AA compliance minimum
- Support keyboard navigation
- Provide alt text for images
- Use semantic HTML

## Color Usage

### Primary Colors
Use for main actions, links, and brand elements:
```css
.primary-action {
  background: var(--primary-600);
  color: var(--text-inverse);
}
```

### Accent Colors
Use sparingly for highlights and important information:
```css
.highlight {
  color: var(--accent-600);
}
```

### Neutral Colors
Use for backgrounds, borders, and secondary text:
```css
.secondary-text {
  color: var(--text-secondary);
}
```


## Typography Guidelines

### Heading Hierarchy
```tsx
<h1 className="text-5xl font-bold">Main Title</h1>
<h2 className="text-4xl font-semibold">Section Title</h2>
<h3 className="text-3xl font-semibold">Subsection</h3>
<h4 className="text-2xl font-medium">Card Title</h4>
```

### Body Text
```tsx
<p className="text-base leading-relaxed">
  Regular paragraph text with comfortable line height
</p>
```

### Small Text
```tsx
<span className="text-sm text-secondary">
  Helper text or metadata
</span>
```

## Spacing & Layout

### Container Padding
- Mobile: 16px (var(--space-4))
- Tablet: 24px (var(--space-6))
- Desktop: 32px (var(--space-8))

### Section Spacing
- Between sections: 64px (var(--space-16))
- Between elements: 24px (var(--space-6))
- Between related items: 16px (var(--space-4))

### Grid Layouts
```css
.grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

## Interactive Elements

### Hover States
All interactive elements must have hover states:
```css
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Focus States
Provide clear focus indicators:
```css
.interactive:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Active States
Show when element is being clicked:
```css
.interactive:active {
  transform: translateY(0);
}
```

## Loading States

### Skeleton Screens
Use skeleton screens instead of spinners:
```tsx
<div className="skeleton-card">
  <div className="skeleton-title" />
  <div className="skeleton-text" />
  <div className="skeleton-text" />
</div>
```

### Progress Indicators
Show progress for long operations:
```tsx
<div className="progress-bar">
  <div className="progress-fill" style={{ width: `${progress}%` }} />
</div>
```

## Error Handling

### Inline Errors
Show errors near the relevant field:
```tsx
<Input
  label="Email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Toast Notifications
Use for global success/error messages:
```tsx
<Toast
  type="success"
  message="Settings saved successfully"
  duration={3000}
/>
```

## Responsive Design

### Mobile First
Start with mobile design, then enhance for larger screens:
```css
.element {
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .element {
    font-size: var(--text-lg);
  }
}
```

### Touch Targets
Minimum 44x44px for touch targets on mobile.

### Breakpoint Strategy
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading
- Provide responsive images

### Code Splitting
- Split routes into separate bundles
- Lazy load heavy components
- Use dynamic imports

## Micro-interactions

### Button Click
```css
@keyframes buttonClick {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

### Card Hover
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

### Page Transitions
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease;
}
```

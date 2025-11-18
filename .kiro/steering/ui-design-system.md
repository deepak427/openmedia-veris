---
inclusion: fileMatch
fileMatchPattern: "**/{components,pages,app,styles}/**/*.{tsx,jsx,css,scss}"
---

# UI Design System - Professional & Luxurious

## Color Palette

### Primary Colors (Modern Professional)
```css
:root {
  /* Primary - Deep Blue (Trust, Professionalism) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;

  /* Accent - Emerald (Success, Growth) */
  --accent-50: #ecfdf5;
  --accent-100: #d1fae5;
  --accent-200: #a7f3d0;
  --accent-300: #6ee7b7;
  --accent-400: #34d399;
  --accent-500: #10b981;
  --accent-600: #059669;
  --accent-700: #047857;
  --accent-800: #065f46;
  --accent-900: #064e3b;

  /* Neutral - Slate (Modern, Clean) */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  --neutral-950: #020617;
}
```

### Semantic Colors
```css
:root {
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-dark: #0f172a;
  --bg-dark-secondary: #1e293b;

  /* Text Colors */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-inverse: #ffffff;

  /* Border Colors */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-dark: #94a3b8;

  /* Shadow Colors */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

### Dark Mode Colors
```css
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --border-light: #334155;
  --border-medium: #475569;
  --border-dark: #64748b;
}
```

## Typography

### Font Families
```css
:root {
  /* Primary Font - Inter (Modern, Professional) */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
  /* Heading Font - Poppins (Luxurious, Bold) */
  --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Monospace Font - JetBrains Mono (Code) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}
```

### Font Sizes (Fluid Typography)
```css
:root {
  /* Base: 16px */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);       /* 14-16px */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);      /* 16-18px */
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);    /* 18-20px */
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);        /* 20-24px */
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);     /* 24-30px */
  --text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem);   /* 30-36px */
  --text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);         /* 36-48px */
  --text-5xl: clamp(3rem, 2.55rem + 2.25vw, 3.75rem);        /* 48-60px */
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Line Heights
```css
:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

## Spacing System

### Consistent Spacing Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

## Border Radius

### Rounded Corners
```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-3xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

## Component Patterns

### Button Styles
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: var(--text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background: linear-gradient(135deg, var(--primary-700), var(--primary-800));
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-primary);
  color: var(--primary-600);
  border: 2px solid var(--primary-600);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-700);
  color: var(--primary-700);
}
```

### Card Styles
```css
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
  border-color: var(--primary-200);
}

.card-luxurious {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-2xl);
  backdrop-filter: blur(10px);
}
```

### Input Styles
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

## Animations

### Smooth Transitions
```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-slower: 500ms ease;
}

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Responsive Design

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}

/* Usage */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
```

### Container Widths
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

## Best Practices

### 1. Use CSS Variables
```css
/* ✅ CORRECT */
.button {
  background: var(--primary-600);
  color: var(--text-inverse);
}

/* ❌ WRONG */
.button {
  background: #2563eb;
  color: #ffffff;
}
```

### 2. Consistent Spacing
```css
/* ✅ CORRECT */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

/* ❌ WRONG */
.card {
  padding: 24px;
  margin-bottom: 15px;
}
```

### 3. Smooth Transitions
```css
/* ✅ CORRECT */
.button {
  transition: all var(--transition-base);
}

/* ❌ WRONG */
.button {
  /* No transition */
}
```

### 4. Accessible Colors
- Ensure contrast ratio of at least 4.5:1 for text
- Use semantic colors for status indicators
- Test with color blindness simulators

### 5. Mobile-First Design
```css
/* ✅ CORRECT - Mobile first */
.element {
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .element {
    font-size: var(--text-lg);
  }
}
```

## Import Fonts

### Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Or via CSS
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

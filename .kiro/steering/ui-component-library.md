---
inclusion: fileMatch
fileMatchPattern: "**/{components,ui}/**/*.{tsx,jsx}"
---

# UI Component Library - Professional React Components

## Component Architecture

### Component Structure
```tsx
// ✅ CORRECT - Well-structured component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

## Essential Components

### 1. Button Component
```tsx
export const Button: React.FC<ButtonProps> = ({ variant, size, children }) => (
  <button className={`btn btn-${variant} btn-${size}`}>
    {children}
  </button>
);
```

### 2. Card Component
```tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, hover }) => (
  <div className={`card ${hover ? 'card-hover' : ''}`}>
    {title && <h3 className="card-title">{title}</h3>}
    <div className="card-content">{children}</div>
  </div>
);
```


### 3. Input Component
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  ...props
}) => (
  <div className="input-wrapper">
    {label && <label className="input-label">{label}</label>}
    <input className={`input ${error ? 'input-error' : ''}`} {...props} />
    {error && <span className="input-error-text">{error}</span>}
    {helperText && <span className="input-helper">{helperText}</span>}
  </div>
);
```

### 4. Modal Component
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
};
```

## Best Practices

### 1. Use TypeScript for Props
Always define prop types with TypeScript interfaces.

### 2. Composition Over Inheritance
Build complex components from simple ones.

### 3. Accessibility First
Include ARIA labels, keyboard navigation, and focus management.

### 4. Responsive by Default
All components should work on mobile, tablet, and desktop.

# Process Styles

This directory contains CSS specific to process views and workflows.

## Purpose

Process-specific styles for:
- Process state indicators
- Workflow visualization
- Progress animations
- Loading states
- Error states
- Success states

## Style Patterns

### State Styles

```css
/* Process state indicators */
.process-idle {
  background-color: #6b7280;
  color: #fff;
}

.process-running {
  background-color: #3b82f6;
  color: #fff;
  animation: pulse 2s infinite;
}

.process-complete {
  background-color: #10b981;
  color: #fff;
}

.process-error {
  background-color: #ef4444;
  color: #fff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Progress Indicators

```css
/* Progress bar */
.progress-container {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #7c3aed);
  transition: width 0.3s ease;
}

/* Loading spinner */
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #00ff88;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Best Practices

1. **Clear Visual Feedback**: Make states obviously different
2. **Smooth Transitions**: Use CSS transitions for state changes
3. **Accessible**: Ensure sufficient color contrast
4. **Performance**: Use GPU-accelerated properties (transform, opacity)
5. **Consistency**: Match the overall application design

## Animation Guidelines

- Keep animations under 300ms for UI feedback
- Use `ease-in-out` for most transitions
- Consider reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

## Related Files

- Process logic: `../js/`
- Rendering: `../render/`
- General styles: `../../asset.store/css/`

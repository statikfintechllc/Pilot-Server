# CSS Assets

This directory contains the stylesheets for the Pilot-Server application.

## Files

### `copilot-chat.css`
Styles for the GitHub Copilot chat interface, including:
- Chat message bubbles
- Input field styling
- Model selector dropdown
- History panel
- Animation effects

### `glass-effects.css`
Glass-morphism and visual effects:
- Frosted glass backgrounds
- Backdrop blur effects
- Gradient overlays
- Transparency and layering

### `copilot-page.css`
Page-specific styles for Copilot integration:
- Navigation header
- Sidebar menu
- Layout structures
- Responsive breakpoints

## Style Guidelines

### Naming Conventions
- Use kebab-case for class names
- Prefix component-specific classes (e.g., `copilot-`, `glass-`)
- Use semantic names that describe purpose, not appearance

### Organization
- Group related styles together
- Add section comments for major components
- Keep selectors specific but not overly nested
- Use CSS variables for theme colors and common values

### Responsive Design
- Mobile-first approach
- Use media queries for larger screens
- Test on various devices and screen sizes
- Consider touch interactions for mobile

### Performance
- Minimize use of expensive properties (box-shadow, filter)
- Use transforms for animations
- Optimize selector performance
- Combine similar rules

## Usage Example

```css
/* Component Styles */
.copilot-chat-message {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .copilot-chat-message {
    padding: 0.75rem;
  }
}
```

## Related Resources
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

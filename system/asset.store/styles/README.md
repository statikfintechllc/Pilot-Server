# Styles

This directory contains additional styling resources and theme files for the Pilot-Server application.

## Purpose

This directory is for:
- Theme configurations
- Color palettes and design tokens
- CSS custom properties (variables)
- Style utilities and helpers
- Alternative style approaches

## Organization

Styles here complement the main CSS files in the `../css/` directory and can include:

### Theme Files
```css
/* theme-variables.css */
:root {
  --primary-color: #00ff88;
  --secondary-color: #7c3aed;
  --background-dark: #0a0e27;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  --border-radius: 0.5rem;
  --transition-speed: 0.3s;
}
```

### Design Tokens
Central location for design system values that are used across the application.

### Utility Classes
Additional utility classes that extend Tailwind CSS or provide custom utilities.

## Usage

Import these files in your main stylesheets or HTML:

```html
<link rel="stylesheet" href="system/asset.store/styles/theme-variables.css">
```

Or import in CSS:

```css
@import url('theme-variables.css');
```

## Best Practices

1. **CSS Variables**: Use CSS custom properties for values that might change
2. **Naming**: Use descriptive, semantic names for variables
3. **Documentation**: Comment the purpose of theme values
4. **Consistency**: Maintain consistency with existing design system
5. **Accessibility**: Ensure color contrasts meet WCAG standards

## Example Structure

```
styles/
├── theme-variables.css     # CSS custom properties
├── utilities.css           # Utility classes
├── animations.css          # Keyframe animations
└── print.css              # Print-specific styles
```

## Related Resources

- Main stylesheets: `../css/`
- Tailwind configuration: `../tailwind/`
- Design documentation: `/docs/`

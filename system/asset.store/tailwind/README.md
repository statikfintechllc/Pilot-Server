# Tailwind CSS Configuration

This directory contains Tailwind CSS configuration and customizations for the Pilot-Server application.

## Purpose

This directory is for:
- Tailwind CSS configuration files
- Custom Tailwind utilities
- Extended theme configurations
- Plugin configurations
- Build configurations

## Current Setup

The application currently uses Tailwind CSS via CDN:

```html
<!-- Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>
```

## Future Configuration

For a production build with custom configuration, you can create a `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./system/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00ff88',
        'secondary': '#7c3aed',
        'dark': {
          100: '#1a1f3a',
          200: '#0f1429',
          300: '#0a0e27',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

## Custom Utilities

You can extend Tailwind with custom utilities:

```css
/* custom-utilities.css */
@layer utilities {
  .glass-effect {
    @apply bg-white/10 backdrop-blur-lg border border-white/20;
  }
  
  .gradient-border {
    border-image: linear-gradient(to right, #00ff88, #7c3aed) 1;
  }
}
```

## Building for Production

To use a custom Tailwind configuration:

1. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss
   ```

2. Create configuration:
   ```bash
   npx tailwindcss init
   ```

3. Build CSS:
   ```bash
   npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
   ```

## Purging Unused CSS

For production, enable purging to remove unused styles:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./system/**/*.{html,js}",
  ],
  // ... rest of config
}
```

This automatically removes unused styles in production builds.

## Best Practices

1. **Use CDN for Development**: Fast iteration without build steps
2. **Custom Build for Production**: Smaller file sizes and custom configuration
3. **Extend, Don't Override**: Use `extend` in theme config to preserve defaults
4. **Document Custom Classes**: Comment purpose of custom utilities
5. **Test Responsiveness**: Verify breakpoints work as expected

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS CDN](https://tailwindcss.com/docs/installation/play-cdn)
- [Customizing Tailwind](https://tailwindcss.com/docs/configuration)

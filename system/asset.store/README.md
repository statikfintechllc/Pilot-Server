# Asset Store

This directory contains static assets for the Pilot-Server application.

## Directory Structure

### `css/`
Stylesheets for the application:
- **copilot-chat.css**: Styles for the Copilot chat interface
- **glass-effects.css**: Glass-morphism effects and visual enhancements
- **copilot-page.css**: Page-specific styles for Copilot pages
- Additional utility and component styles

### `js/`
JavaScript modules:
- **auth.js**: Firebase authentication logic
- **copilot-chat.js**: Copilot chat functionality and AI integration
- **mobile-keyboard-tailwind.js**: Mobile keyboard handling and viewport adjustments
- Additional feature modules

### `templates/`
HTML template files for dynamic content rendering

### `styles/`
Additional styling resources and theme files

### `tailwind/`
Tailwind CSS configuration and custom utilities

## Usage

Assets in this directory are referenced by the application's HTML files:

```html
<!-- CSS -->
<link rel="stylesheet" href="system/asset.store/css/glass-effects.css">
<link rel="stylesheet" href="system/asset.store/css/copilot-page.css">

<!-- JavaScript -->
<script src="system/asset.store/js/auth.js"></script>
<script src="system/asset.store/js/copilot-chat.js"></script>
```

## Development Guidelines

When adding or modifying assets:

1. **CSS Files**:
   - Follow BEM naming convention where applicable
   - Group related styles together
   - Add comments for complex styling
   - Maintain consistency with existing styles

2. **JavaScript Files**:
   - Use ES6+ features
   - Keep modules focused and single-purpose
   - Handle errors appropriately
   - Document complex functions

3. **Performance**:
   - Optimize file sizes
   - Consider lazy loading for non-critical assets
   - Use appropriate image formats and compression

## Asset Guidelines

- Keep assets organized by type and purpose
- Use descriptive file names
- Compress images before committing
- Document significant changes
- Test across browsers and devices

## Related Files

- Main application: `../../index.html`
- System configuration: `../system.html`

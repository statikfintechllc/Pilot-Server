# JavaScript Assets

This directory is reserved for asset-related JavaScript utilities.

## Note

Processing logic JavaScript files have been moved to `../process.store/js/`:
- `auth.js` - GitHub authentication and API integration
- `copilot-chat.js` - Chat interface and UI functionality
- `mobile-keyboard-tailwind.js` - Mobile keyboard optimization

## Purpose

This directory is intended for JavaScript files that are directly related to asset management, such as:
- Asset loading utilities
- Image processing helpers
- Style manipulation utilities
- Template rendering helpers

## Development Guidelines

### Code Style
```javascript
// Use ES6+ features
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Use descriptive variable names
const assetLoaded = true;
const resourceCache = [];

// Document complex functions
/**
 * Loads and caches an asset
 * @param {string} assetPath - Path to the asset
 * @returns {Promise<Object>}
 */
async function loadAsset(assetPath) {
  // Implementation
}
```

### Module Organization
- Keep modules focused on a single responsibility
- Export functions and classes explicitly
- Use async/await for asynchronous operations
- Handle errors appropriately

### Performance
- Minimize DOM operations
- Cache DOM queries
- Use requestAnimationFrame for animations
- Lazy load when possible

## Related Documentation
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

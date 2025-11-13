# JavaScript Assets

This directory contains JavaScript modules for the Pilot-Server application.

## Files

### `auth.js`
Firebase authentication module:
- User sign-in/sign-up
- Session management
- Authentication state handling
- User profile management

### `copilot-chat.js`
GitHub Copilot chat functionality:
- Message handling and display
- AI model integration
- Chat history management
- Streaming responses
- Context management

### `mobile-keyboard-tailwind.js`
Mobile keyboard optimization:
- Dynamic viewport adjustment
- Input field positioning
- Keyboard show/hide detection
- iOS and Android compatibility
- Touch event handling

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
const userAuthenticated = true;
const chatMessages = [];

// Document complex functions
/**
 * Adjusts viewport for mobile keyboard
 * @param {boolean} isKeyboardVisible - Whether keyboard is visible
 * @returns {void}
 */
function adjustViewport(isKeyboardVisible) {
  // Implementation
}
```

### Module Organization
- Keep modules focused on a single responsibility
- Export functions and classes explicitly
- Use async/await for asynchronous operations
- Handle errors appropriately

### Event Handling
- Remove event listeners when no longer needed
- Use event delegation where appropriate
- Debounce/throttle frequent events (scroll, resize)
- Prevent default behavior when necessary

### Performance
- Minimize DOM operations
- Cache DOM queries
- Use requestAnimationFrame for animations
- Lazy load when possible

## Error Handling

Always handle errors gracefully:

```javascript
try {
  // Risky operation
  await performOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly message
  showErrorMessage('Something went wrong. Please try again.');
}
```

## Testing

When modifying JavaScript:
1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Check console for errors
4. Verify error handling
5. Test edge cases

## Related Documentation
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Firebase Documentation](https://firebase.google.com/docs)

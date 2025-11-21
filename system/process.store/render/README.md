# Render

This directory contains rendering logic and templates for the Pilot-Server application.

## Purpose

The render system handles:
- Dynamic content generation
- Template processing
- View rendering
- Component composition

## Rendering Patterns

### Template-Based Rendering

```javascript
// Escape HTML to prevent XSS attacks
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Simple template rendering with security
function render(template, data) {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    const escapedValue = escapeHtml(String(value));
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), escapedValue);
  }
  return html;
}
```

### Component Rendering

```javascript
// Component-based rendering
class Component {
  constructor(props) {
    this.props = props;
  }
  
  render() {
    return `
      <div class="component">
        <h3>${this.props.title}</h3>
        <p>${this.props.content}</p>
      </div>
    `;
  }
  
  mount(selector) {
    const element = document.querySelector(selector);
    element.innerHTML = this.render();
  }
}
```

## Best Practices

1. **Escape User Input**: Always sanitize user-provided content
2. **Efficient Updates**: Only re-render changed components
3. **Accessibility**: Include ARIA attributes in rendered HTML
4. **Performance**: Use document fragments for batch rendering
5. **Error Handling**: Gracefully handle rendering errors

## Security

When rendering dynamic content:

```javascript
// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Use when rendering user content
const safeContent = escapeHtml(userInput);
```

## File Organization

- Keep templates modular and reusable
- Organize by feature or component type
- Use clear, descriptive file names
- Document template variables and requirements

## Related Resources

- Templates: `../../asset.store/templates/`
- Process logic: `../js/`
- Styling: `../css/`

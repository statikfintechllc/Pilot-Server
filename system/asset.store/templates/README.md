# Templates

This directory contains HTML template files for dynamic content rendering in the Pilot-Server application.

## Purpose

Templates are reusable HTML components that can be:
- Loaded dynamically via JavaScript
- Populated with data at runtime
- Used for consistent UI patterns across the application
- Modified without changing core application code

## Structure

Templates should be:
- Self-contained HTML fragments
- Well-documented with comments
- Semantic and accessible
- Responsive by default

## Example Template Structure

```html
<!-- template-name.html -->
<div class="component-wrapper">
  <h3 class="component-title">{{title}}</h3>
  <p class="component-description">{{description}}</p>
  <button class="component-action" data-action="{{action}}">
    {{buttonText}}
  </button>
</div>
```

## Usage

Templates can be loaded and used in JavaScript:

```javascript
// Load template
async function loadTemplate(templateName) {
  const response = await fetch(`system/asset.store/templates/${templateName}.html`);
  const template = await response.text();
  return template;
}

// Populate template with data
function populateTemplate(template, data) {
  let html = template;
  for (const [key, value] of Object.entries(data)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return html;
}

// Use template
const template = await loadTemplate('card');
const html = populateTemplate(template, {
  title: 'My Title',
  description: 'My Description',
  action: 'click',
  buttonText: 'Click Me'
});
document.getElementById('container').innerHTML = html;
```

## Best Practices

1. **Keep Templates Simple**: Focus on structure, not logic
2. **Use Placeholders**: Mark dynamic content with clear identifiers (e.g., {{variable}})
3. **Maintain Consistency**: Follow existing patterns and naming conventions
4. **Document Template Variables**: Comment what data each template expects
5. **Test Thoroughly**: Verify templates work with various data inputs

## Template Guidelines

- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Follow responsive design principles
- Keep CSS classes consistent with the project style
- Avoid inline styles

## Related Files

- JavaScript loading logic: `../js/`
- Stylesheet references: `../css/`

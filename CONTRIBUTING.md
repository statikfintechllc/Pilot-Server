# Contributing to Pilot-Server

Thank you for your interest in contributing to Pilot-Server! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and what you expected to see
- Include screenshots if applicable
- Note your browser/environment details

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List any alternatives you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request** with a comprehensive description

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor or IDE
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/statikfintechllc/Pilot-Server.git
   cd Pilot-Server
   ```

2. Open `index.html` in your browser to view the application

3. Make your changes to the relevant files:
   - HTML files for structure
   - CSS files in `system/asset.store/css/` for styling
   - JavaScript files in `system/asset.store/js/` for functionality

### Project Structure

```
Pilot-Server/
├── index.html              # Main entry point
├── system/
│   ├── asset.store/        # Static assets
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript files
│   │   └── templates/     # HTML templates
│   ├── process.store/      # Process-related files
│   └── icons.logo/         # Logo and icons
└── docs/                   # Documentation
```

## Style Guidelines

### HTML

- Use semantic HTML5 elements
- Maintain proper indentation (2 spaces)
- Include appropriate ARIA labels for accessibility
- Keep files organized and well-commented

### CSS

- Follow BEM naming convention where applicable
- Use meaningful class names
- Group related styles together
- Add comments for complex styling

### JavaScript

- Use ES6+ features
- Write clear, self-documenting code
- Add comments for complex logic
- Handle errors appropriately
- Follow consistent naming conventions:
  - camelCase for variables and functions
  - PascalCase for classes

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Example:
```
Add mobile keyboard optimization

- Implement dynamic viewport adjustment
- Fix input field positioning on keyboard open
- Add touch event handlers for better mobile UX

Fixes #123
```

## Testing

Before submitting a pull request:

1. Test your changes in multiple browsers (Chrome, Firefox, Safari)
2. Test on different screen sizes and devices
3. Verify that existing functionality still works
4. Check for console errors
5. Validate HTML and CSS when possible

## Documentation

- Update README files if you add or change features
- Add inline comments for complex code
- Update this CONTRIBUTING.md if you change the contribution process
- Keep documentation clear and concise

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the "question" label
- Start a discussion in the GitHub Discussions tab
- Review existing documentation and issues

## Recognition

Contributors will be recognized in the project. Thank you for helping improve Pilot-Server!

## License

By contributing to Pilot-Server, you agree that your contributions will be licensed under the same license as the project.

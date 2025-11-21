# Development Setup

This project uses Tailwind CSS for styling, built locally rather than loaded from CDN for GitHub Pages compatibility.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

```bash
npm install
```

## Building CSS

### Production Build (Minified)
```bash
npm run build:css
```

This generates `system/asset.store/css/tailwind-output.css` which is committed to the repository for GitHub Pages deployment.

### Development Mode (Watch)
```bash
npm run watch:css
```

This watches for changes in HTML/JS files and automatically rebuilds the Tailwind CSS.

## Project Structure

```
Pilot-Server/
├── system/
│   ├── asset.store/          # Static assets
│   │   ├── css/
│   │   │   ├── tailwind-input.css    # Tailwind source file
│   │   │   ├── tailwind-output.css   # Generated Tailwind CSS (committed)
│   │   │   ├── copilot-page.css      # Custom page styles
│   │   │   └── copilot-chat.css      # Custom chat styles
│   │   └── js/                       # Asset utilities (empty for now)
│   └── process.store/        # Application logic
│       └── js/
│           ├── auth.js                # GitHub authentication
│           ├── copilot-chat.js        # Chat interface
│           └── mobile-keyboard-tailwind.js  # Mobile keyboard handler
├── tailwind.config.js        # Tailwind configuration
├── package.json              # npm configuration
└── index.html                # Main application page
```

## Notes

- `tailwind-output.css` is committed to the repository (not gitignored) because GitHub Pages needs it for deployment
- After making changes to Tailwind classes in HTML/JS files, run `npm run build:css` before committing
- `node_modules/` is gitignored as usual

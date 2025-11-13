# Icons & Logo

This directory contains branding assets for the Pilot-Server application.

## Contents

### Logo Files
- **pilot.card.png**: Main application logo/card image

### Icon Assets
Icons for various platforms and use cases:
- App icons
- Favicon
- PWA icons
- Social media icons
- Touch icons for mobile devices

## File Format Guidelines

### Logo
- **Format**: PNG with transparency
- **Sizes**: Provide multiple sizes for different contexts
- **Usage**: Headers, about pages, branding materials

### Icons
- **App Icons**: 192x192, 512x512 (for PWA)
- **Favicon**: 16x16, 32x32, 64x64
- **Touch Icons**: 180x180 (Apple), 192x192 (Android)
- **Format**: PNG for color, SVG for vector graphics

## Recommended Sizes

```
icons/
├── favicon.ico          # 16x16, 32x32, 64x64
├── icon-16.png         # 16x16
├── icon-32.png         # 32x32
├── icon-64.png         # 64x64
├── icon-192.png        # 192x192 (Android)
├── icon-512.png        # 512x512 (PWA)
└── apple-touch-icon.png # 180x180 (iOS)
```

## Usage in HTML

```html
<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="system/icons.logo/icon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="system/icons.logo/icon-16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="system/icons.logo/apple-touch-icon.png">

<!-- Android/Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="system/icons.logo/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="system/icons.logo/icon-512.png">
```

## PWA Manifest

Reference icons in `manifest.json`:

```json
{
  "name": "Pilot-Server",
  "short_name": "Pilot",
  "icons": [
    {
      "src": "system/icons.logo/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "system/icons.logo/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Design Guidelines

### Logo
- Maintain clear space around the logo
- Don't distort or modify the logo
- Use on appropriate backgrounds for contrast
- Preserve the aspect ratio

### Colors
- Primary: #00ff88
- Secondary: #7c3aed
- Background: #0a0e27

### Accessibility
- Ensure icons are recognizable at small sizes
- Provide adequate contrast
- Include alt text when used in HTML

## Creating New Icons

1. **Design**: Create vector graphics in SVG
2. **Export**: Generate PNG files at required sizes
3. **Optimize**: Compress images without quality loss
4. **Test**: Verify appearance across devices

## Tools

- **Optimization**: [ImageOptim](https://imageoptim.com/), [TinyPNG](https://tinypng.com/)
- **Favicon Generation**: [RealFaviconGenerator](https://realfavicongenerator.net/)
- **SVG Editing**: [Figma](https://figma.com/), [Inkscape](https://inkscape.org/)

## Related Files

- PWA Manifest: `/manifest.json`
- HTML references: `/index.html`

# Pilot Server - AI Chat Interface

## Core Purpose & Success
- **Mission Statement**: A multi-model AI chat interface providing seamless mobile-first conversations with GitHub integration and customizable theming.
- **Success Indicators**: Smooth model switching, persistent conversations, intuitive mobile interface, and seamless theme transitions.
- **Experience Qualities**: Professional, Responsive, Intuitive

## Project Classification & Approach
- **Complexity Level**: Complex Application (advanced functionality, persistent state)
- **Primary User Activity**: Interacting (conversational AI interface)

## Essential Features

### Core Chat Functionality
- Multi-model AI support with floating model selector
- Real-time message streaming and conversation history
- Mobile-optimized chat interface with proper touch targets
- Persistent chat sessions using KV storage

### Theme System ✨ NEW
- **Light Mode**: Clean, bright interface optimized for daytime use
- **Dark Mode**: Easy-on-eyes dark interface for low-light environments  
- **System Mode**: Automatically follows user's system preference
- **Smooth Transitions**: 200ms ease-in-out transitions between themes
- **Persistent Selection**: Theme choice saved across sessions

### Mobile Experience
- Responsive sidebar with slide-out navigation
- Safe area handling for modern mobile devices
- Touch-optimized controls and interactions
- Hidden scrollbars while maintaining scroll functionality

### GitHub Integration (Planned)
- OAuth authentication
- Repository browsing and code analysis
- Issue and PR creation from chat

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional confidence with approachable warmth
- **Design Personality**: Clean, modern, tech-forward but not intimidating
- **Visual Metaphors**: Conversation bubbles, floating elements, smooth transitions
- **Simplicity Spectrum**: Minimal interface that scales elegantly

### Color Strategy
- **Color Scheme Type**: Monochromatic with blue accent
- **Primary Color**: Deep blue (oklch(0.4 0.15 240)) for trust and professionalism
- **Secondary Colors**: Muted grays for supporting elements
- **Accent Color**: Bright cyan (oklch(0.75 0.15 195)) for interactive highlights
- **Theme Adaptation**: Full light/dark theme support with smooth transitions

### Typography System
- **Font Pairing Strategy**: Inter for UI, JetBrains Mono for code
- **Typographic Hierarchy**: Clear sizing scale from 14px mobile base to larger headers
- **Font Personality**: Modern, clean, highly legible
- **Readability Focus**: Optimized line heights and spacing for conversation flows

## Implementation Considerations

### Theme System Architecture
- KV storage for theme persistence across sessions
- CSS custom properties for dynamic theme switching
- ResizeObserver optimization to prevent notification loops
- Smooth 200ms transitions for professional feel

### Mobile Optimizations
- Touch target minimums (44px)
- Safe area insets for modern devices
- Hidden scrollbars with maintained functionality
- Slide-out navigation with proper gesture support

## Recent Updates
- ✅ Added comprehensive theme system (light/dark/system)
- ✅ Implemented theme toggle in header and mobile sidebar
- ✅ Added smooth theme transitions with CSS custom properties
- ✅ Integrated system preference detection and auto-switching
- ✅ Persistent theme selection using KV storage
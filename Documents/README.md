# Pilot Server - AI Chat Interface

A modern, professional AI chat interface built with React and TypeScript that provides seamless multi-model conversations with GitHub OAuth authentication. **Now with iOS App support and Device Flow authentication!**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![iOS](https://img.shields.io/badge/iOS-Compatible-blue.svg)

## ✨ Features

### 🤖 Multi-Model AI Chat
- **Model Switching**: Seamlessly switch between GPT-4o and GPT-4o-mini within conversations
- **Context Preservation**: Maintain conversation context across model changes
- **Real-time Responses**: Fast, responsive chat experience with immediate feedback

### � iOS App Integration (NEW!)
- **Device Flow OAuth**: No manual GitHub OAuth app setup required
- **Embedded Server**: Self-contained server for mobile deployment
- **Network Agnostic**: Works on any IP/port without configuration
- **Native iOS Support**: Optimized for iOS app embedding

### 🔐 Secure Authentication
- **GitHub Device Flow**: Modern OAuth flow perfect for mobile apps
- **Legacy OAuth Support**: Backward compatible with traditional web OAuth
- **Token Management**: Safe handling of authentication tokens with proxy server
- **Session Persistence**: Stay logged in across browser sessions

### 💬 Advanced Chat Features
- **Conversation History**: Persistent chat history with ability to create new conversations
- **Message Management**: Edit messages and switch between different response versions
- **Image Upload**: Upload and analyze images with AI (drag-and-drop support)
- **Code Highlighting**: Syntax highlighting for code blocks with copy functionality

### 🎨 Professional UI/UX
- **Clean Design**: Modern, glassmorphic interface optimized for long coding sessions
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Sidebar Navigation**: Collapsible sidebar for efficient screen space usage

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **React Router** for navigation

### Backend
- **Express.js** server for OAuth proxy
- **Device Flow OAuth** for iOS app support
- **CORS** enabled for secure cross-origin requests
- **GitHub OAuth** integration (traditional + device flow)

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **Vite** for hot module replacement

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **GitHub OAuth App** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/statikfintechllc/Pilot-Server.git
   cd Pilot-Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # GitHub OAuth Configuration
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   VITE_GITHUB_CLIENT_SECRET=your_github_client_secret
   VITE_GITHUB_REDIRECT_URI=http://localhost:3001/auth/callback
   ```

4. **Start the development servers**
   
   **Terminal 1** - Start the OAuth proxy server:
   ```bash
   node server.js
   ```
   
   **Terminal 2** - Start the frontend development server:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5174 (or auto-assigned port)
   - OAuth Server: http://localhost:3001

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Pilot Server
   - **Homepage URL**: http://localhost:5174
   - **Authorization callback URL**: http://localhost:3001/auth/callback
3. Copy the Client ID and Client Secret to your `.env` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Yes |
| `VITE_GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | Yes |
| `VITE_GITHUB_REDIRECT_URI` | OAuth callback URL | Yes |

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   OAuth Proxy    │    │    GitHub       │
│   (React App)   │    │   (Express.js)   │    │    OAuth        │
│   Port: 5174    │◄──►│   Port: 3001     │◄──►│    Server       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

- **Frontend (React)**: User interface and chat functionality
- **OAuth Proxy (Express)**: Secure token exchange with GitHub
- **GitHub OAuth**: Authentication and authorization

### Data Flow

1. User initiates GitHub OAuth login
2. GitHub redirects to OAuth proxy server
3. Proxy exchanges code for access token
4. Frontend receives token and authenticates user
5. User can now access chat functionality

## 📱 Usage

### Starting a Chat
1. **Authenticate**: Log in with your GitHub account
2. **Select Model**: Choose between GPT-4o or GPT-4o-mini using the model selector
3. **Start Chatting**: Type your message and press Enter or click Send

### Advanced Features
- **New Conversation**: Click the "New Chat" button to start fresh
- **Upload Images**: Drag and drop images or click the upload button
- **Copy Code**: Use the copy button on code blocks for easy integration
- **Switch Models**: Change AI models mid-conversation while preserving context

## 🔨 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run optimize` | Optimize dependencies |

### Building for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Linting and Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## 🚦 Troubleshooting

### Common Issues

1. **OAuth Authentication Fails**
   - Verify GitHub OAuth app configuration
   - Check environment variables are set correctly
   - Ensure callback URL matches OAuth app settings

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility (18+)

3. **CORS Issues**
   - Verify both servers are running on correct ports
   - Check CORS configuration in server.js

4. **Port Conflicts**
   - Change ports in vite.config.ts (frontend) or server.js (backend)
   - Kill existing processes: `npm run kill`

### Performance Optimization

- Large bundle warning is expected due to comprehensive UI components
- Consider code splitting for production deployments
- Use `npm run optimize` to optimize dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing code style
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About

Developed by [Statik Fintech LLC](https://github.com/statikfintechllc) - Creating modern, professional tools for developers and technical professionals.

---

**Need help?** Open an issue or check our [troubleshooting guide](#-troubleshooting) above.
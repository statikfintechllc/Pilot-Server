# Pilot-Server

> A modern GitHub Copilot chat interface with advanced AI model selection and conversation management.

## 🚀 Overview

Pilot-Server is a web-based GitHub Copilot chat application that provides an intuitive interface for interacting with various AI models. It features a sleek glass-morphism design, mobile optimization, and comprehensive conversation management capabilities.

## ✨ Features

- **🤖 AI Chat Interface**: Interactive chat with multiple AI model options
- **🔄 Model Selection**: Choose from various AI models (GPT-4o, Claude, Gemini, and more)
- **💬 Conversation Management**: Save, organize, and revisit chat histories
- **📱 Mobile-Optimized**: Fully responsive design that works seamlessly on all devices
- **🎨 Modern UI**: Glass-morphism design with smooth animations and interactions
- **⌨️ Smart Input Handling**: Advanced keyboard and mobile input management

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS with glass effects
- **Authentication**: GitHub Personal Access Token (PAT)
- **Fonts**: Inter, JetBrains Mono
- **Icons**: SVG graphics

## 📁 Project Structure

```
Pilot-Server/
├── index.html              # Main application entry point
├── system/
│   ├── asset.store/        # Static assets
│   │   ├── css/           # Stylesheets (glass effects, copilot styles)
│   │   ├── js/            # JavaScript modules (auth, chat, keyboard handler)
│   │   ├── templates/     # HTML templates
│   │   └── styles/        # Additional styling resources
│   ├── process.store/      # Process-related files and renders
│   ├── icons.logo/         # Application logos and icons
│   └── system.html         # System configuration page
├── docs/                   # Documentation
│   ├── CODE_OF_CONDUCT.md  # Community guidelines
│   ├── CONTRIBUTING.md     # Contribution guidelines
│   └── SECURITY.md         # Security policy
└── .github/                # GitHub templates and workflows
    ├── ISSUE_TEMPLATE/     # Issue templates (bug, feature, question)
    ├── DISCUSSION_TEMPLATE/ # Discussion templates
    └── pull_request_template.md
```

## 🚦 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge recommended)
- Basic understanding of HTML, CSS, and JavaScript (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/statikfintechllc/Pilot-Server.git
   cd Pilot-Server
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

3. For local development, you can use a simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

4. Navigate to `http://localhost:8000` in your browser

## 💻 How to Use the UI

Pilot-Server features an intuitive, modern interface designed for seamless AI interactions. Here's a comprehensive guide to navigating and using the application:

### 🎯 Main Interface Components

#### **Navigation Bar (Top)**
The fixed navigation bar at the top of the screen provides quick access to all major features:

- **Hamburger Menu (Left)**: Click to open the sidebar navigation menu
- **Copilot Icon & Title (Center)**: Shows you're in the Copilot chat interface
- **Model Selector**: Drop-down button displaying current AI model (e.g., "GPT-4o")
  - Click to see and select from available AI models
  - Models are categorized by capability (Fast, Versatile, Powerful)
- **History Button**: View and access your previous chat conversations
- **New Chat Button (+)**: Start a fresh conversation with the AI

#### **Sidebar Menu**
Access the sidebar by clicking the hamburger menu (☰) in the top-left:

- **Home**: Return to the main copilot interface

#### **Chat Interface (Center)**
The main area where you interact with the AI:

- **Welcome Message**: Greeting and quick guide to what you can ask
- **Message History**: Scrollable conversation with the AI
- **Input Area (Bottom)**:
  - Text box: Type your questions or requests
  - Send Button: Submit your message to the AI

### 📝 Using the Copilot Chat

#### **Starting a Conversation**
1. Click in the input box at the bottom of the screen
2. Type your question or request
3. Click "Send" or press Enter

#### **Example Questions You Can Ask**
- "Help me understand this code snippet"
- "What are best practices for React components?"
- "Explain the difference between async/await and promises"
- "How can I optimize this algorithm?"
- "What's the best way to structure this project?"

#### **Switching AI Models**
Different models excel at different tasks:

1. Click the model selector button (shows current model name)
2. Browse the categorized list:
   - **Fast & Efficient**: Quick responses for simple queries
   - **Versatile**: Balanced performance for most tasks
   - **Powerful**: Deep analysis for complex scenarios
3. Click your preferred model to switch

#### **Managing Chat History**
1. Click the "History" button in the top-right
2. View all your previous conversations
3. Click any conversation to restore it
4. Use "New Chat" button to start fresh while keeping history

### 🎨 Interface Features

#### **Glass-Morphism Design**
- Semi-transparent panels with blur effects
- Smooth animations and transitions
- Purple/cyan accent colors for interactive elements

#### **Mobile-Optimized**
- Responsive layout adapts to any screen size
- Touch-friendly buttons and controls
- Optimized keyboard handling on mobile devices
- Gesture support for navigation

#### **Dark Theme**
- Eye-friendly dark interface for extended sessions
- High contrast for readability
- Reduced blue light for comfortable viewing

### 💡 Pro Tips

1. **Quick Navigation**: Use the sidebar menu to quickly switch between different sections
2. **Context Matters**: Provide specific details in your questions for better AI responses
3. **Save Important Chats**: Review your history to revisit valuable insights
4. **Try Different Models**: Experiment with various AI models for different types of analysis
5. **Mobile Usage**: The interface works perfectly on phones and tablets for on-the-go access

### 🔧 Keyboard Shortcuts

- **Enter**: Send message (in chat input)
- **Esc**: Close dropdowns and modals
- **Tab**: Navigate between interactive elements

### 📱 Mobile-Specific Features

- **Adaptive Input**: Keyboard automatically adjusts viewport
- **Touch Gestures**: Swipe to open/close sidebar menu
- **Optimized Buttons**: Large touch targets for easy interaction
- **Auto-Focus**: Input field activates for quick message entry

## 💻 Usage

### Main Features

1. **Copilot Chat**: 
   - Click the chat icon to open the Copilot interface
   - Ask questions about coding, development, or technical topics
   - Select different AI models from the dropdown

2. **Conversation Management**:
   - Save and organize your chat conversations
   - Access previous chats from the history
   - Start new conversations while preserving history

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting pull requests.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 🔒 Security

Security is a top priority. If you discover a security vulnerability, please follow our [Security Policy](docs/SECURITY.md) for responsible disclosure.

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](docs/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

This project is maintained by Statik Fintech LLC. All rights reserved.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- GitHub Copilot integration for AI-powered assistance
- Inspired by modern chat interface design patterns

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/statikfintechllc/Pilot-Server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/statikfintechllc/Pilot-Server/discussions)
- **Questions**: Use the question issue template or discussions

## 🗺️ Roadmap

- [ ] Enhanced AI model support
- [ ] Advanced conversation organization
- [ ] Mobile app version
- [ ] Real-time collaboration features
- [ ] Plugin system for extensibility
- [ ] Advanced search capabilities

## 📊 Project Status

Active development - contributions welcome!

---

**Made with ❤️ by Statik Fintech LLC**

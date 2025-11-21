# Pilot-Server

> A professional penny stock trading journal with automated tracking, analysis, and GitHub Copilot integration.

## 🚀 Overview

Pilot-Server is a web-based trading journal application designed specifically for penny stock traders. It provides a comprehensive platform for tracking trades, analyzing performance, and receiving AI-powered insights through GitHub Copilot integration.

## ✨ Features

- **📊 Trade Tracking**: Log and monitor all your penny stock trades in one place
- **📈 Analytics Dashboard**: Visualize your trading performance with detailed charts and metrics
- **🤖 AI-Powered Copilot**: Get intelligent insights and analysis using GitHub Copilot integration
- **📝 Trading Notes**: Keep detailed notes for each trade and strategy
- **📚 Books & Resources**: Access curated trading resources and educational materials
- **📱 Mobile-Optimized**: Fully responsive design that works seamlessly on all devices
- **🎨 Modern UI**: Glass-morphism design with smooth animations and interactions
- **🔐 GitHub Authentication**: Secure authentication using GitHub OAuth/PAT

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS with glass effects
- **Authentication**: GitHub OAuth/PAT
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
├── .github/                # GitHub templates and workflows
│   ├── ISSUE_TEMPLATE/    # Issue templates (bug, feature, question)
│   ├── DISCUSSION_TEMPLATE/ # Discussion templates
│   └── pull_request_template.md
├── CODE_OF_CONDUCT.md      # Community guidelines
├── CONTRIBUTING.md         # Contribution guidelines
└── SECURITY.md             # Security policy
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

Pilot-Server features an intuitive, modern interface designed for professional traders. Here's a comprehensive guide to navigating and using the application:

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
- **Books**: Access your trading education library
- **Notes**: View and manage your trading notes
- **Trades Section**:
  - All Trades: Complete trade history
  - All Summaries: Weekly/monthly trade summaries
  - Analytics: Performance metrics and visualizations
  - Import CSV: Bulk import trades from CSV files
- **Mentors**: Quick links to Timothy Sykes and Tim Bohen resources

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
2. Type your question or request about trading
3. Click "Send" or press Enter

#### **Example Questions You Can Ask**
- "Analyze my recent trades and identify patterns"
- "What are the key indicators for penny stock momentum?"
- "Help me create a trading plan for volatile stocks"
- "Review my trade from [date] and suggest improvements"
- "What risk management strategies should I use?"

#### **Switching AI Models**
Different models excel at different tasks:

1. Click the model selector button (shows current model name)
2. Browse the categorized list:
   - **Fast & Efficient**: Quick responses for simple queries
   - **Versatile**: Balanced performance for most tasks
   - **Powerful**: Deep analysis for complex trading scenarios
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
- Eye-friendly dark interface for extended trading sessions
- High contrast for readability
- Reduced blue light for night trading

### 💡 Pro Tips

1. **Quick Navigation**: Use the sidebar menu to quickly switch between different sections
2. **Context Matters**: Provide specific details in your questions for better AI responses
3. **Save Important Chats**: Review your history to revisit valuable insights
4. **Try Different Models**: Experiment with various AI models for different types of analysis
5. **Mobile Usage**: The interface works perfectly on phones and tablets for trading on-the-go

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
   - Ask questions about trading strategies, trade analysis, or get insights
   - Select different AI models from the dropdown

2. **Trade Management**:
   - Navigate to "All Trades" to view your complete trading history
   - Add new trades with detailed information
   - Import trades from CSV files

3. **Analytics**:
   - Access the Analytics page for performance metrics
   - View weekly summaries and patterns
   - Analyze win rates, average gains, and other key metrics

4. **Books & Notes**:
   - Access educational resources
   - Keep organized notes on strategies and learnings

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🔒 Security

Security is a top priority. If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md) for responsible disclosure.

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

This project is maintained by Statik Fintech LLC. All rights reserved.

## 🙏 Acknowledgments

- Inspired by professional trading mentors Timothy Sykes and Tim Bohen
- Built with modern web technologies and best practices
- GitHub Copilot integration for AI-powered insights

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/statikfintechllc/Pilot-Server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/statikfintechllc/Pilot-Server/discussions)
- **Questions**: Use the question issue template or discussions

## 🗺️ Roadmap

- [ ] Enhanced AI model support
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Real-time trade notifications
- [ ] Social trading features
- [ ] Advanced charting capabilities

## 📊 Project Status

Active development - contributions welcome!

---

**Made with ❤️ by Statik Fintech LLC**

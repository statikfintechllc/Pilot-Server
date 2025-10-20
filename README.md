<div align="center">
  <a href="https://statikfintechllc.github.io/Ascend-Institute/">
    <img src="https://img.shields.io/badge/SFTi's-darkred?style=for-the-badge&logo=dragon&logoColor=gold"/>
  <a href="https://statikfintechllc.github.io/Ascend-Institute/">
    <img src="https://img.shields.io/badge/Home%20Page-black?style=for-the-badge&logo=ghost&logoColor=gold"/>
  </a><br>
</div> 
<div align="center">
  <a href="https://github.com/sponsors/statikfintechllc">
    <img src="https://skillicons.dev/icons?i=python,bash,linux,anaconda,tailwind,css,react,nodejs,electron,go,typescript,javascript,html,astro,nix&theme=dark" alt="Skill icons">
  </a><br>
  <a href="https://github.com/sponsors/statikfintechllc">
    <img src="https://raw.githubusercontent.com/KDK-Grim/WorkFlowRepo-Mirror/master/docs/ticker-bot/ticker.gif" alt="Repo Ticker Stats" height="36">
  </a>

# Pilot Server 
**A GitHub Powered AI Chat Interface**

</div>

*A modern, professional AI chat interface built with React and TypeScript that provides seamless multi-model conversations with GitHub OAuth authentication.*

*Designed specifically for developers and technical professionals who need a clean, efficient way to interact with AI models.*

## 🎯 True Plug & Play Deployment

**Clone, Install, Run - That's It!**

```bash
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server
npm install && npm run dev
```

✅ Works immediately in localStorage mode - no configuration needed!
✅ Add Supabase credentials later for cross-device sync (optional)
✅ Deploy to GitHub Pages with zero config (optional)
✅ Add to home screen for native app experience (optional)

**Three Ways to Use:**
1. **Instant Demo** - Clone and run (works offline, localStorage only)
2. **GitHub Pages** - Visit deployed site, sign in, start chatting
3. **Add to Home Screen** - Use like a native app

See [`docs/PLUG_AND_PLAY.md`](docs/PLUG_AND_PLAY.md) for complete deployment guide.

## ✨ Features

### 🤖 Multi-Model AI Chat
- **Model Switching**: Seamlessly switch between GPT-4o and GPT-4o-mini within conversations
- **Context Preservation**: Maintain conversation context across model changes
- **Real-time Responses**: Fast, responsive chat experience with immediate feedback

### 🔐 Secure Authentication
- **VS Code-Style Auth**: Modern authentication flow inspired by VS Code
- **GitHub OAuth via Supabase**: No custom backend required
- **Persistent Sessions**: Stay logged in across browser sessions
- **Secure Token Management**: Tokens managed by Supabase Auth

### 💬 Advanced Chat Features
- **Conversation History**: Persistent chat history stored in Supabase database
- **Message Management**: Edit messages and switch between different response versions
- **Image Upload**: Upload and analyze images with AI (drag-and-drop support)
- **Code Highlighting**: Syntax highlighting for code blocks with copy functionality
- **RAG Integration**: Retrieval-Augmented Generation for context-aware responses

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
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL with pgvector** for vector similarity search
- **Row Level Security (RLS)** for data protection
- **Supabase Auth** for OAuth integration

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **Vite** for hot module replacement

## 🚀 Quick Start

### Instant Use (No Setup Required)

```bash
# Clone and run - works immediately!
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server
npm install
npm run dev
```

The app runs in **localStorage mode** by default - fully functional, no configuration needed!

### Production Deployment (GitHub Pages)

**For Repository Maintainers:**

See [`docs/PLUG_AND_PLAY.md`](docs/PLUG_AND_PLAY.md) for complete plug-and-play deployment with shared Supabase instance.

Quick setup:
1. Add repository secrets (Supabase credentials)
2. Push to main branch
3. GitHub Actions deploys automatically
4. Users can access at: `https://yourusername.github.io/Pilot-Server`

**For Users:**

- **Live Demo**: Visit the deployed GitHub Pages site
- **Local Install**: Clone and run (works offline)
- **Add to Home Screen**: Works like a native app

### Features by Mode

**localStorage Mode (Default - No Setup):**
- ✅ Full chat interface
- ✅ All AI models  
- ✅ Chat history (browser storage)
- ✅ Completely offline capable

**Supabase Mode (With Configuration):**
- ✅ All localStorage features
- ✅ Cross-device sync
- ✅ Persistent database
- ✅ Multi-user support
- ✅ RAG features (with OpenAI key)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager

**Optional** (for database features):
- **Supabase Account** (free tier available at https://supabase.com)
- **OpenAI API Key** (for RAG functionality)

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

3. **Start the development server**
   
   ```bash
   npm run dev
   ```

The app will start on `http://localhost:4173` in localStorage mode.

### Optional: Enable Database Features

To enable Supabase and RAG features, see [`docs/PLUG_AND_PLAY.md`](docs/PLUG_AND_PLAY.md) for:
- Using a shared Supabase instance
- Setting up your own instance
- Enabling RAG with OpenAI

**Simple Setup:**

## 🔧 Configuration

### Supabase Setup

For detailed Supabase configuration, see [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

Quick overview:
1. Create a Supabase project
2. Enable GitHub OAuth provider in Authentication settings
3. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
4. Copy your Supabase URL and anon key to `.env`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key for embeddings | Yes (for RAG) |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Optional |

**Note**: The Supabase anon key is safe to expose in the browser because Row Level Security (RLS) protects all data access.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │    GitHub       │
│   (React App)   │    │   Platform       │    │    OAuth        │
│   Static Site   │◄──►│   Auth + DB      │◄──►│    Server       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   + pgvector     │
                       │   + RLS          │
                       └──────────────────┘
```

For detailed architecture documentation, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

### Key Components

- **Frontend (React)**: User interface and chat functionality
- **Supabase Auth**: VS Code-style GitHub OAuth authentication
- **Supabase Database**: PostgreSQL with Row Level Security
- **pgvector**: Vector similarity search for RAG
- **OpenAI API**: Embedding generation for RAG

### Data Flow

1. User initiates GitHub OAuth login via Supabase
2. Supabase handles OAuth flow with GitHub
3. User session is established and stored
4. Chat messages are saved to Supabase database
5. RAG system generates and stores embeddings
6. Vector search provides context for AI responses

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
   - Verify Supabase GitHub OAuth is configured correctly
   - Check callback URL matches Supabase settings
   - Ensure browser allows cookies and localStorage

2. **Database Connection Errors**
   - Verify Supabase URL and anon key are correct
   - Check Row Level Security policies
   - Ensure migrations were run successfully

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility (18+)

4. **RAG Not Working**
   - Verify OpenAI API key is valid
   - Check pgvector extension is enabled in Supabase
   - Ensure embeddings table exists

5. **Port Conflicts**
   - Change port in vite.config.ts
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

<div align="center">
  <a href="https://github.com/sponsors/statikfintechllc">
    <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/L.W.badge.svg" alt="Like my work?" />
  </a>
</div>
<div align="center">
<a href="https://github.com/sponsors/statikfintechllc">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/git.sponsor.svg">
</a><br>
<a href="https://ko-fi.com/statikfintech_llc">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/kofi.sponsor.svg">
</a><br>
<a href="https://patreon.com/StatikFinTech_LLC">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/patreon.sponsor.svg">
</a><br>
<a href="https://cash.app/$statikmoney8">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/cashapp.sponsor.svg">
</a><br>
<a href="https://paypal.me/statikmoney8">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/paypal.sponsor.svg">
</a><br>
<a href="https://www.blockchain.com/explorer/addresses/btc/bc1qarsr966ulmcs3mlcvae7p63v4j2y2vqrw74jl8">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/bitcoin.sponsor.svg">
</a><br>
<a href="https://etherscan.io/address/0xC2db50A0fc6c95f36Af7171D8C41F6998184103F">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/ethereum.sponsor.svg">
</a><br>
<a href="https://www.chime.com">
  <img src="https://raw.githubusercontent.com/statikfintechllc/statikfintechllc/master/badges/chime.sponsor.svg">
</a>
</div>

 **Want to See you're own ideas built, or to sponsor hardware directly? Reach Out to:**
- **Email:** [ascend.gremlin@gmail.com](mailto:ascend.gremlin@gmail.com) | [ascend.help@gmail.com](mailto:ascend.help@gmail.com)
- **Call Us:** [+1 (620) 266-9837](sms:+16202669837)  
- **Text Us:** [+1 (785) 443-6288](sms:+17854436288)  
- **DM:**  
  - a) [LinkedIn: StatikFinTech, LLC](https://www.linkedin.com/in/statikfintech-llc-780804368/)
  - b) [X: @GremlinsForge](https://twitter.com/GremlinsForge)  

**See Our [Open Funding Proposal](https://github.com/statikfintechllc/Ascend-Institute/blob/master/About%20Us/OPEN_FUNDING_PROPOSAL.md)**

<div align="center">

  <br/> [© 2025 StatikFinTech, LLC](https://www.github.com/statikfintechllc/GremlinGPT/blob/master/LICENSE.md)

  <a href="https://github.com/statikfintechllc">
    <img src="https://img.shields.io/badge/-000000?logo=github&logoColor=white&style=flat-square" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/daniel-morris-780804368">
    <img src="https://img.shields.io/badge/In-e11d48?logo=linkedin&logoColor=white&style=flat-square" alt="LinkedIn">
  </a>
  <a href="mailto:ascend.gremlin@gmail.com">
    <img src="https://img.shields.io/badge/-D14836?logo=gmail&logoColor=white&style=flat-square" alt="Email">
  </a>
  <a href="https://www.youtube.com/@Gremlins_Forge">
    <img src="https://img.shields.io/badge/-FF0000?logo=youtube&logoColor=white&style=flat-square" alt="YouTube">
  </a>
  <a href="https://x.com/GremlinsForge">
    <img src="https://img.shields.io/badge/-000000?logo=x&logoColor=white&style=flat-square" alt="X">
  </a>
  <a href="https://medium.com/@ascend.gremlin">
    <img src="https://img.shields.io/badge/-000000?logo=medium&logoColor=white&style=flat-square" alt="Medium">
  </a>  
</div>

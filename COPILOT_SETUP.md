# GitHub Copilot Integration Setup

This application uses GitHub Copilot's API for AI model communication, using the same authentication and endpoint approach as VS Code Chat.

## How It Works

### Architecture
- **Static Site**: Hosted on GitHub Pages (no backend server required)
- **Authentication**: GitHub Personal Access Token (PAT)
- **API Endpoint**: `https://api.githubcopilot.com/chat/completions`
- **Approach**: Same as VS Code Chat extension

### Authentication Flow

1. User clicks "Sign In" in Profile dropdown
2. User enters their GitHub Personal Access Token (PAT)
3. Token is stored in `localStorage` (browser storage)
4. All API requests use this token for authentication

### Requirements

To use this application, users need:

1. **GitHub Account** with GitHub Copilot enabled
   - Sign up at: https://github.com/features/copilot
   
2. **GitHub Personal Access Token (PAT)**
   - Create at: https://github.com/settings/tokens
   - Required scopes: `copilot`, `read:user`
   - Token type: Classic PAT or Fine-grained PAT with Copilot access

### API Compatibility

The implementation matches VS Code Chat extension:

```javascript
// API Endpoint
const apiUrl = 'https://api.githubcopilot.com/chat/completions';

// Headers (matching VS Code)
{
  'Authorization': 'Bearer ${token}',
  'Content-Type': 'application/json',
  'Editor-Version': 'vscode/1.95.0',
  'Editor-Plugin-Version': 'copilot-chat/0.22.0',
  'Copilot-Integration-Id': 'vscode-chat'
}

// Request Body
{
  model: 'gpt-4o',  // or any supported model
  messages: [...],   // conversation history
  temperature: 0.7,
  max_tokens: 2000
}
```

### Supported Models

The application supports the same models available in GitHub mobile app:

**Fast & Efficient:**
- GPT-5-mini
- Grok Code Fast 1

**Versatile and Highly Intelligent:**
- GPT-4.1
- GPT-5
- GPT-4o (default)
- Claude Sonnet 3.5
- Claude Sonnet 4
- Claude Sonnet 4.5
- Claude Haiku 4.5

**Most Powerful at Complex Tasks:**
- Claude Opus 4.1
- Gemini 2.5 Pro

### Security Considerations

**Token Storage:**
- Tokens are stored in browser `localStorage`
- Not ideal for production but acceptable for demos/prototypes
- Consider more secure approaches for production:
  - Backend proxy with secure session management
  - OAuth flow instead of PAT
  - Token encryption before storage

**CORS:**
- GitHub Copilot API supports CORS for browser requests
- Works from GitHub Pages domains
- May have restrictions on other domains

### Troubleshooting

**401 Unauthorized:**
- Token is invalid or expired
- User doesn't have GitHub Copilot enabled
- Token doesn't have required scopes

**403 Forbidden:**
- GitHub Copilot subscription required
- User needs to subscribe at github.com/features/copilot

**404 Not Found:**
- Model not available with user's subscription
- Try a different model from the dropdown

**429 Rate Limited:**
- Too many requests in short time
- Wait a moment and try again

### Development

For local development:
```bash
# Start local server
python3 -m http.server 8080

# Open in browser
http://localhost:8080
```

### Deployment

For GitHub Pages deployment:
1. Push code to `main` or `gh-pages` branch
2. Enable GitHub Pages in repository settings
3. Site will be available at: `https://{username}.github.io/{repo-name}/`

### References

- GitHub Copilot API: https://docs.github.com/en/copilot
- VS Code Copilot Chat: https://github.com/microsoft/vscode-copilot
- GitHub PAT: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

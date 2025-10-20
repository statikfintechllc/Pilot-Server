# VS Code-Style Authentication with Supabase and RAG

This document explains the new authentication system, database integration, and RAG functionality implemented in Pilot Server.

## Architecture Overview

The Pilot Server now uses a modern, production-ready architecture inspired by VS Code's authentication flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    Static Site (GitHub Pages)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Application (Browser)                 │  │
│  │                                                        │  │
│  │  ┌──────────────┐      ┌─────────────────────────┐  │  │
│  │  │ VS Code Auth │◄────►│   Supabase Client      │  │  │
│  │  │   Provider   │      │   (Auth + Database)     │  │  │
│  │  └──────────────┘      └─────────────────────────┘  │  │
│  │          │                        │                  │  │
│  │          │                        ▼                  │  │
│  │          │              ┌──────────────────┐        │  │
│  │          │              │  RAG System      │        │  │
│  │          │              │  (Vector Search) │        │  │
│  │          │              └──────────────────┘        │  │
│  └──────────┼────────────────────────────────────────── │  │
│             │                                            │
└─────────────┼────────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │   Supabase       │
    │   Platform       │
    │                  │
    │ ┌──────────────┐ │
    │ │ PostgreSQL   │ │
    │ │ + pgvector   │ │
    │ └──────────────┘ │
    │ ┌──────────────┐ │
    │ │ GitHub OAuth │ │
    │ │   Provider   │ │
    │ └──────────────┘ │
    │ ┌──────────────┐ │
    │ │ Row Level    │ │
    │ │  Security    │ │
    │ └──────────────┘ │
    └──────────────────┘
              │
              ▼
    ┌──────────────────┐
    │   GitHub         │
    │   OAuth Server   │
    └──────────────────┘
```

## Key Features

### 1. VS Code-Style Authentication

The authentication system mimics VS Code's approach:

- **No Custom Backend Required**: All OAuth flows are handled by Supabase
- **Persistent Sessions**: Sessions are stored in localStorage and automatically restored
- **Secure Token Management**: Access tokens are managed by Supabase's Auth system
- **GitHub OAuth Integration**: Seamless GitHub authentication with proper scopes

#### How It Works

1. User clicks "Sign in with GitHub"
2. `VSCodeAuthProvider.createSession()` is called
3. User is redirected to GitHub OAuth (via Supabase)
4. GitHub redirects back to Supabase with authorization code
5. Supabase exchanges code for access token
6. User is redirected back to the app at `/auth/callback`
7. `VSCodeAuthProvider.handleCallback()` processes the session
8. User data is fetched from GitHub API and stored in database
9. Session is saved to localStorage for persistence

### 2. Database Integration (Supabase)

All data is stored in Supabase PostgreSQL with Row Level Security:

#### Tables

- **user_profiles**: User information synced from GitHub
- **chats**: Chat conversation metadata
- **chat_messages**: Individual chat messages
- **document_embeddings**: Vector embeddings for RAG

#### Row Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only access their own data
- No data leakage between users
- Server-side security enforcement

Example policy:
```sql
CREATE POLICY "Users can view their own chats"
    ON chats FOR SELECT
    USING (auth.uid() = user_id);
```

### 3. RAG (Retrieval-Augmented Generation)

The RAG system enhances chat responses with context from stored documents:

#### Components

1. **Embedding Generation**: Uses OpenAI's `text-embedding-3-small` model
2. **Vector Storage**: Embeddings stored in PostgreSQL with pgvector extension
3. **Similarity Search**: Fast vector search using cosine similarity
4. **Context Augmentation**: Relevant documents are added to chat prompts

#### Usage

```typescript
import { storeDocument, augmentWithContext } from '@/lib/rag';

// Store a document with embeddings
await storeDocument(userId, documentContent, { source: 'upload' });

// Augment a chat message with context
const augmentedMessage = await augmentWithContext(userId, userMessage);
```

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   └── vscode-auth.ts      # VS Code-style auth provider
│   ├── supabase/
│   │   ├── client.ts           # Supabase client configuration
│   │   └── chat-service.ts     # Database operations for chats
│   └── rag/
│       └── index.ts            # RAG system implementation
├── hooks/
│   └── use-vscode-auth.ts      # React hook for authentication
└── components/
    ├── AuthGuard.tsx           # Protected route wrapper
    └── GitHubCallback.tsx      # OAuth callback handler

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema

docs/
└── SUPABASE_SETUP.md          # Setup instructions
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (for RAG)
VITE_OPENAI_API_KEY=your-openai-api-key

# GitHub OAuth (optional)
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

## Deployment

### GitHub Pages

The application is designed to work as a static site on GitHub Pages:

1. **No Server Required**: All backend functionality is handled by Supabase
2. **Automatic Deployment**: GitHub Actions workflow deploys on push to main
3. **OAuth Redirects**: Configured to work with static hosting

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file handles:
- Building the application
- Deploying to GitHub Pages
- Setting up custom domain (optional)

## Security Considerations

### Client-Side API Keys

⚠️ **Important**: The current implementation includes API keys in the browser for development convenience. For production:

1. **Supabase Keys**: The `anon` key is safe to expose (protected by RLS)
2. **OpenAI Key**: Should be moved to a serverless function (Supabase Edge Functions)
3. **GitHub OAuth**: Credentials are handled entirely by Supabase (secure)

### Production Recommendations

For production deployment:

1. Move OpenAI embedding generation to Supabase Edge Functions
2. Implement rate limiting on RAG operations
3. Add content moderation for user-generated embeddings
4. Use Supabase's built-in abuse protection

## Testing

### Local Development

1. Set up Supabase project (see `docs/SUPABASE_SETUP.md`)
2. Copy `.env.example` to `.env` and fill in credentials
3. Run migrations in Supabase SQL Editor
4. Start development server: `npm run dev`

### Authentication Flow

1. Click "Sign in with GitHub"
2. Complete GitHub OAuth
3. Verify user profile appears in `user_profiles` table
4. Test creating chats and messages

### RAG System

1. Store test documents using the RAG API
2. Query with similar content
3. Verify context is added to responses
4. Check `document_embeddings` table for entries

## Migration from Old System

The old authentication system (custom OAuth proxy) has been replaced with:

- ✅ Supabase Auth (handles OAuth entirely)
- ✅ VS Code-style session management
- ✅ Database persistence
- ✅ RAG functionality

### Breaking Changes

- `useAuth()` is replaced with `useVSCodeAuth()`
- Manual OAuth token exchange is removed
- Chat history now persists in database
- Server.js proxy is no longer needed

## Troubleshooting

### Authentication Issues

- **"Session not found"**: Clear localStorage and try again
- **OAuth redirect fails**: Verify callback URL in Supabase dashboard
- **Token expired**: The system auto-refreshes tokens

### Database Issues

- **RLS errors**: Check policies in Supabase dashboard
- **Connection fails**: Verify Supabase URL and keys
- **Slow queries**: Check indexes are created

### RAG Issues

- **Embeddings fail**: Verify OpenAI API key
- **No results**: Check vector similarity threshold
- **Slow search**: Ensure pgvector index is created

## Future Enhancements

Planned improvements:

1. **Supabase Edge Functions**: Move OpenAI calls to serverless functions
2. **Real-time Collaboration**: Use Supabase Realtime for shared chats
3. **File Upload**: Store files in Supabase Storage
4. **Advanced RAG**: Implement chunking and reranking
5. **Analytics**: Track usage with Supabase Analytics

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [VS Code Authentication](https://code.visualstudio.com/api/references/vscode-api#authentication)

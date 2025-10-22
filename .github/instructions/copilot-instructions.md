# Copilot Instructions for Pilot Server

This is **Pilot Server**, a production-ready AI chat interface built as a **static site** with **Supabase backend**. The application uses a sophisticated tier-based access system, VS Code-style authentication, and includes RAG (Retrieval-Augmented Generation) capabilities.

## Project Overview

**Pilot Server** is a GitHub-powered AI chat interface featuring:

- **Dual-mode operation**: localStorage-only (no setup) + Supabase cloud sync
- **Tier-based access system**: 7 tiers from free to premium ($0-$50/month)  
- **VS Code-style GitHub OAuth**: Seamless authentication via Supabase
- **Multi-model AI chat**: GitHub Models API integration with conversation history
- **RAG system**: Vector search with pgvector for enhanced responses
- **PWA support**: Installable as native app with offline capabilities
- **Message versioning**: Edit messages and switch between AI response versions

## Architecture

```
Static Site (GitHub Pages) ←→ Supabase (Auth+DB+RLS) ←→ GitHub OAuth
                ↓
localStorage (fallback) + PostgreSQL + pgvector (RAG)
                ↓  
GitHub Models API (GPT-4o, GPT-4o-mini, etc.)
```

**Key Architectural Decisions:**
- **No custom backend server** - Supabase handles all backend needs
- **Static site deployment** - Works on GitHub Pages with zero configuration  
- **localStorage fallback** - App works immediately without any setup
- **RLS security** - All database access controlled by Row Level Security policies
- **GitHub Models direct integration** - No proxy server, uses user's GitHub auth token

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite 7.1.10 (static site)
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Database**: PostgreSQL with pgvector extension for RAG
- **Authentication**: VS Code-style GitHub OAuth via Supabase
- **UI Framework**: Radix UI, Tailwind CSS 4.1.11, Framer Motion
- **Build/Deploy**: GitHub Actions → GitHub Pages (zero config)
- **AI Models**: GitHub Models API (no proxy server needed)

## Essential Development Patterns

### 1. Dual-Mode State Management Pattern

The app operates in two modes seamlessly:

```typescript
// Hook pattern: localStorage with database sync
const [chats, setChats] = useState<Chat[]>(() => {
  const saved = localStorage.getItem('pilot-chats');
  return saved ? JSON.parse(saved) : [];
});

// Save to localStorage AND Supabase when available
useEffect(() => {
  localStorage.setItem('pilot-chats', JSON.stringify(chats));
  // Database sync happens separately in chat service
}, [chats]);
```

**Critical**: Always maintain localStorage fallback - app must work without Supabase.

### 2. VS Code Authentication Pattern

Authentication mimics VS Code's GitHub integration:

```typescript
// VSCodeAuthProvider creates GitHub OAuth sessions
const session = await authProvider.createSession(['read:user', 'user:email']);
// Uses user's GitHub token directly with GitHub Models API
const response = await fetch('https://models.github.ai/inference/chat/completions', {
  headers: { 'Authorization': `Bearer ${authState.accessToken}` }
});
```

**File locations:**
- `src/lib/auth/vscode-auth.ts` - Core auth provider
- `src/hooks/use-vscode-auth.ts` - React hook wrapper
- `src/components/AuthGuard.tsx` - Route protection

### 3. Message Versioning System

Messages support editing with version history:

```typescript
interface Message {
  id: string;
  content: string;
  versions?: MessageVersion[];         // Edit history
  currentVersionIndex?: number;        // Active version
  isEdited?: boolean;
}

// Edit user message → regenerates AI response
const editMessage = async (messageId: string, newContent: string) => {
  // Truncate conversation after edited message
  // Call GitHub Models API for new response
  // Maintain version history
};
```

### 4. Tier System Integration

Access control through database-driven tier system:

```typescript
// Check user's sponsorship tier
const tierAccess = await checkUserTier(userId);
if (tierAccess.tier < REQUIRED_TIER) {
  // Show upgrade prompt, limit features
}
```

**Tiers**: Open Use ($0) → Power User ($5-15) → All-Access ($20-50)

## Critical File Structure

```
src/
├── hooks/
│   ├── use-chat.ts              # Main chat state management
│   ├── use-vscode-auth.ts       # VS Code-style authentication  
│   └── use-chat-with-db.ts      # Database integration for chats
├── lib/
│   ├── auth/vscode-auth.ts      # GitHub OAuth provider (VS Code style)
│   ├── supabase/
│   │   ├── client.ts            # Supabase client config
│   │   └── chat-service.ts      # Chat database operations
│   ├── rag/index.ts             # RAG system (vector search)
│   └── types.ts                 # Core TypeScript definitions
├── components/
│   ├── AuthGuard.tsx            # Route protection
│   ├── GitHubCallback.tsx       # OAuth callback handler
│   ├── SignUp.tsx               # Tier pricing page
│   └── ui/                      # Radix UI components
scripts/
├── validate-imports.cjs         # Import validation for CI
├── validate-api-usage.cjs       # API usage validation  
└── validate-error-handling.cjs  # Error handling validation
supabase/migrations/             # Database schema
```

## Development Commands

```bash
# Development (runs on port 4173)
npm run dev

# Quality checks (run before commits)
npm run validate:all            # Validates imports, API usage, error handling
npm run lint                    # ESLint with React hooks rules
npm run test:quality            # Full quality suite

# Build and deployment
npm run build                   # Static site build
npm run preview                 # Preview production build

# Validation scripts for AI development
npm run validate:imports        # Check all imports resolve
npm run validate:api-usage      # Validate API integration patterns
npm run validate:error-handling # Ensure proper error boundaries
```

## Core Integration Patterns

### GitHub Models API Usage

```typescript
// Direct API call with user's GitHub token (no proxy)
const response = await fetch('https://models.github.ai/inference/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authState?.accessToken}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  },
  body: JSON.stringify({
    model: chatState.selectedModel,
    messages: conversationHistory,
    temperature: 0.7,
    max_tokens: 32000
  })
});
```

### Supabase Database Pattern

```typescript
// RLS automatically filters by user
const { data: chats } = await supabase
  .from('chats')
  .select('*')
  .order('updated_at', { ascending: false });

// RLS policies ensure users only see their own data
// No need to filter by user_id in queries
```

### RAG Vector Search

```typescript
// Store document with embeddings
await storeDocument(userId, content, metadata);

// Search for relevant context
const context = await matchDocuments(
  queryEmbedding, 
  0.7, // similarity threshold
  5    // max results
);
```

## Component Architecture Guidelines

### AuthGuard Pattern
Every protected component should be wrapped in `<AuthGuard>`:

```typescript
function ProtectedComponent() {
  return (
    <AuthGuard>
      {/* Component content */}
    </AuthGuard>
  );
}
```

### Error Boundaries
Critical components use error boundaries:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ChatMessages />
</ErrorBoundary>
```

### Theme Provider
All UI components support dual themes:

```typescript
<ThemeProvider>
  <Component /> {/* Automatically gets theme context */}
</ThemeProvider>
```

## Common Development Issues

### 1. Import Resolution
**Issue**: TypeScript can't resolve `@/` imports
**Solution**: Check `utils/vite.config.ts` alias configuration

### 2. Supabase RLS Policies
**Issue**: Database queries return empty results
**Solution**: Verify RLS policies in Supabase dashboard, ensure `auth.uid()` matches `user_id`

### 3. GitHub API Rate Limits  
**Issue**: API calls failing with 403
**Solution**: Implement exponential backoff, check token scopes

### 4. localStorage Persistence
**Issue**: State not persisting across browser sessions
**Solution**: Ensure `useEffect` dependencies are correct for localStorage sync

### 5. Message Versioning
**Issue**: Edit operations corrupting chat state
**Solution**: Always create new version entries, never mutate existing versions

## Security Considerations

### Client-Side API Keys
- **Supabase anon key**: Safe to expose (protected by RLS)
- **GitHub tokens**: Managed by Supabase Auth (secure)
- **OpenAI key**: Currently client-side (consider Edge Functions for production)

### Row Level Security
All database tables have RLS policies:
```sql
CREATE POLICY "Users can view their own chats"
    ON chats FOR SELECT
    USING (auth.uid() = user_id);
```

### Content Validation
Always validate user inputs before database storage or API calls.

## PWA Configuration

App supports installation as native app:
- `public/manifest.json` - PWA manifest
- `public/service-worker.js` - Offline support
- `index.html` - PWA meta tags and service worker registration

Users can install via browser "Add to Home Screen" prompt.

## Deployment Flow

1. **Push to main branch** → GitHub Actions triggered
2. **Build static site** → `npm run build`
3. **Deploy to GitHub Pages** → Automatic deployment
4. **Users access** → `https://username.github.io/Pilot-Server`

No server configuration needed - works entirely as static site with Supabase backend.


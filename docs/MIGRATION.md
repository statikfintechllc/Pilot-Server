# Migration Guide: Old Auth System to VS Code-Style + Supabase

This guide helps you migrate from the old custom OAuth proxy system to the new VS Code-style authentication with Supabase integration.

## What Changed

### Old System (Deprecated)
- Custom Express.js OAuth proxy server (server.js)
- Manual token exchange with GitHub
- localStorage-only persistence
- No database integration
- Manual session management

### New System
- VS Code-style authentication flow
- Supabase handles all OAuth
- PostgreSQL database with Row Level Security
- RAG (Retrieval-Augmented Generation) support
- Automatic session management
- No backend server required

## Migration Steps

### 1. Update Dependencies

The new dependencies are already included in `package.json`:

```json
{
  "@supabase/supabase-js": "latest",
  "@supabase/ssr": "latest",
  "openai": "latest"
}
```

Run:
```bash
npm install
```

### 2. Set Up Supabase

Follow the complete setup guide in [`docs/SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

Quick steps:
1. Create a Supabase project at https://supabase.com
2. Enable GitHub OAuth provider
3. Run the database migration from `supabase/migrations/001_initial_schema.sql`
4. Copy your credentials

### 3. Update Environment Variables

**Old `.env`:**
```env
VITE_GITHUB_CLIENT_ID=xxx
VITE_GITHUB_CLIENT_SECRET=xxx
VITE_GITHUB_REDIRECT_URI=http://localhost:3001/auth/callback
```

**New `.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_GITHUB_CLIENT_ID=xxx  # Optional - for additional GitHub API calls
```

### 4. Update Code References

#### Authentication Hook

**Old:**
```typescript
import { useAuth } from '@/hooks/use-auth';

const { authState, signIn, signOut } = useAuth();
```

**New:**
```typescript
import { useVSCodeAuth } from '@/hooks/use-vscode-auth';

const { authState, signIn, signOut } = useVSCodeAuth();
```

#### Chat Hook

**Old:**
```typescript
import { useChat } from '@/hooks/use-chat';

const { chats, sendMessage } = useChat();
```

**New (with database):**
```typescript
import { useChatWithDatabase } from '@/hooks/use-chat-with-db';

const { chats, sendMessage } = useChatWithDatabase();
```

Or continue using the old hook for localStorage-only:
```typescript
import { useChat } from '@/hooks/use-chat';  // Still works
```

### 5. Remove Old Server Code

You can now delete:
- `server.js` (OAuth proxy no longer needed)
- Any code that directly calls GitHub OAuth endpoints

### 6. Test the New System

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Click "Sign in with GitHub"
   - Complete OAuth flow
   - Verify you're redirected back to the app
   - Check that your profile appears in Supabase `user_profiles` table

3. **Test database persistence:**
   - Create a new chat
   - Send messages
   - Refresh the page
   - Verify chats persist (stored in Supabase)

4. **Test RAG (optional):**
   - Use the RAG Manager component
   - Upload a document
   - Send a message related to the document
   - Verify context is included in the response

## Feature Comparison

| Feature | Old System | New System |
|---------|-----------|------------|
| Authentication | Custom OAuth proxy | Supabase Auth |
| Session Storage | localStorage only | localStorage + Database |
| Chat Persistence | localStorage only | PostgreSQL Database |
| User Profiles | In-memory only | Database with sync |
| GitHub OAuth | Manual implementation | Managed by Supabase |
| Static Hosting | Requires proxy server | Fully static compatible |
| RAG Support | ❌ No | ✅ Yes (with pgvector) |
| Row Level Security | ❌ No | ✅ Yes |
| Real-time Updates | ❌ No | ✅ Possible (Supabase Realtime) |

## Backwards Compatibility

### localStorage Migration

The new system automatically attempts to load old chats from localStorage if Supabase is unavailable. This ensures:

1. Existing chats are not lost
2. Users can continue using the app offline
3. Gradual migration to database storage

### Fallback Behavior

If Supabase is not configured:
- Authentication falls back to localStorage-only mode
- Chats are stored in localStorage
- RAG features are disabled
- App continues to function without database

## Common Migration Issues

### Issue: "Session not found"

**Cause:** Old localStorage session format
**Fix:** Clear localStorage and sign in again
```javascript
localStorage.clear();
```

### Issue: "Database connection failed"

**Cause:** Incorrect Supabase credentials
**Fix:** Verify `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Issue: "OAuth redirect loop"

**Cause:** Callback URL mismatch
**Fix:** Ensure Supabase callback URL matches your app URL
- Development: `http://localhost:4173/auth/callback`
- Production: `https://yourusername.github.io/Pilot-Server/auth/callback`

### Issue: "RLS policy error"

**Cause:** Row Level Security policies not applied
**Fix:** Re-run the migration SQL in Supabase SQL Editor

## Testing Checklist

- [ ] Supabase project created
- [ ] GitHub OAuth enabled in Supabase
- [ ] Database migration executed successfully
- [ ] Environment variables configured
- [ ] Can sign in with GitHub
- [ ] User profile created in database
- [ ] Can create new chats
- [ ] Chats persist after refresh
- [ ] Can send and receive messages
- [ ] Messages stored in database
- [ ] RAG document upload works (if using RAG)
- [ ] Can sign out successfully

## Rollback Plan

If you need to rollback to the old system:

1. Restore old environment variables
2. Start the OAuth proxy server: `node server.js`
3. Use the old `useAuth()` hook
4. Data in localStorage will still be available

However, note:
- Chats stored in Supabase won't be accessible
- RAG features won't work
- Database features will be disabled

## Next Steps

After successful migration:

1. **Configure GitHub Pages deployment**
   - Update repository settings
   - Configure custom domain (optional)
   - Set up the GitHub Actions workflow

2. **Optimize RAG settings**
   - Adjust similarity thresholds
   - Configure embedding dimensions
   - Set up document chunking (if needed)

3. **Monitor usage**
   - Check Supabase dashboard for usage stats
   - Monitor API quota (OpenAI embeddings)
   - Review database size and performance

## Support

For issues during migration:

1. Check [`docs/SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for setup details
2. Review [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) for system overview
3. Open an issue on GitHub with details

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)

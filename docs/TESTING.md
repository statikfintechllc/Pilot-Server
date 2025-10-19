# Testing Guide for Pilot Server

This guide covers testing the new VS Code-style authentication, Supabase integration, and RAG features.

## Prerequisites for Testing

Before you begin testing, ensure you have:

1. **Supabase Project**: Created and configured (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
2. **Environment Variables**: Properly configured in `.env`
3. **Dependencies**: Installed via `npm install`
4. **Database Migration**: Run successfully in Supabase SQL Editor

## Test Checklist

### 1. Build and Development Server

- [ ] Build succeeds without errors
  ```bash
  npm run build
  ```

- [ ] Development server starts without errors
  ```bash
  npm run dev
  ```

- [ ] No console errors in browser (except expected Supabase connection warnings if not configured)

### 2. Authentication Flow

#### Test 2.1: Initial Load (Not Authenticated)

- [ ] App loads the AuthGuard component
- [ ] "Sign in with GitHub" button is visible
- [ ] Features list is displayed correctly
- [ ] No errors in console

#### Test 2.2: GitHub OAuth Sign-In

- [ ] Click "Sign in with GitHub"
- [ ] Redirected to GitHub OAuth page
- [ ] GitHub shows correct app name and requested permissions
- [ ] After authorization, redirected back to app
- [ ] Callback handler processes the authentication
- [ ] User is logged in and sees the chat interface

Expected flow:
```
1. Click Sign In → 2. GitHub OAuth → 3. Callback → 4. Authenticated
```

#### Test 2.3: Session Persistence

- [ ] Sign in successfully
- [ ] Refresh the page (F5)
- [ ] User remains authenticated
- [ ] No need to sign in again
- [ ] User data is restored from session

#### Test 2.4: User Profile in Database

- [ ] Open Supabase Dashboard → Table Editor → `user_profiles`
- [ ] Verify your user profile exists
- [ ] Check fields: `id`, `github_id`, `username`, `email`, `avatar_url`
- [ ] Verify data matches your GitHub profile

#### Test 2.5: Sign Out

- [ ] Click user menu/settings
- [ ] Click "Sign Out"
- [ ] Session is cleared
- [ ] Redirected to login screen
- [ ] Verify session is removed from localStorage
- [ ] Verify cannot access protected routes

### 3. Database Integration

#### Test 3.1: Create New Chat

- [ ] Click "New Chat" button
- [ ] Chat is created and appears in sidebar
- [ ] Check Supabase Dashboard → `chats` table
- [ ] Verify new chat record exists
- [ ] Verify `user_id` matches your user ID

#### Test 3.2: Send Messages

- [ ] Type a message and send
- [ ] Message appears in chat interface
- [ ] Check Supabase Dashboard → `chat_messages` table
- [ ] Verify message record exists
- [ ] Check fields: `chat_id`, `user_id`, `role`, `content`

#### Test 3.3: Chat Persistence

- [ ] Create chat and send messages
- [ ] Refresh the page
- [ ] Verify chats are loaded from database
- [ ] Verify all messages are restored
- [ ] Verify message order is correct

#### Test 3.4: Multiple Chats

- [ ] Create multiple chats
- [ ] Send messages to different chats
- [ ] Switch between chats
- [ ] Verify each chat maintains its own messages
- [ ] Verify switching doesn't lose data

#### Test 3.5: Delete Chat

- [ ] Create a test chat
- [ ] Add some messages
- [ ] Delete the chat
- [ ] Verify chat removed from sidebar
- [ ] Check Supabase → `chats` table (should be gone)
- [ ] Check Supabase → `chat_messages` (messages should be gone)

### 4. RAG (Retrieval-Augmented Generation)

#### Test 4.1: RAG Manager Component

- [ ] Access RAG Manager (if integrated in UI)
- [ ] Component loads without errors
- [ ] "Upload Document" button is visible
- [ ] Document count displays correctly

#### Test 4.2: Upload Document

- [ ] Paste content into RAG Manager textarea
- [ ] Click "Upload Document"
- [ ] Success message appears
- [ ] Document count increments
- [ ] Check Supabase → `document_embeddings` table
- [ ] Verify embedding record exists with vector data

#### Test 4.3: Vector Search

This requires some manual testing via SQL:

```sql
-- In Supabase SQL Editor
-- Note: This example uses an arbitrary embedding for testing the query structure.
-- In production, you would generate a proper query embedding from your search text.
SELECT 
  content,
  metadata,
  1 - (embedding <=> (SELECT embedding FROM document_embeddings LIMIT 1)) as similarity
FROM document_embeddings
WHERE user_id = 'your-user-id'
ORDER BY similarity DESC
LIMIT 5;
```

- [ ] Query returns results
- [ ] Similarity scores are between 0 and 1
- [ ] Results are ordered by similarity

Note: For production use, generate embeddings using the RAG system's `generateEmbedding()` function.

#### Test 4.4: Context Augmentation

To test RAG in chat:

- [ ] Upload a document with specific information
- [ ] Send a chat message related to that document
- [ ] Check browser console for RAG augmentation logs
- [ ] Verify context is added to the message (if logging is enabled)

#### Test 4.5: Delete All Documents

- [ ] Click "Clear All" in RAG Manager
- [ ] Confirm deletion
- [ ] Document count goes to 0
- [ ] Check Supabase → `document_embeddings` (should be empty for your user)

### 5. Row Level Security (RLS)

#### Test 5.1: Own Data Access

- [ ] Sign in as User A
- [ ] Create chats and messages
- [ ] Verify data is accessible

#### Test 5.2: Other Users' Data Isolation

This requires two different GitHub accounts:

- [ ] Sign in as User A, create data
- [ ] Sign out
- [ ] Sign in as User B
- [ ] Verify User B cannot see User A's chats
- [ ] Verify User B cannot see User A's messages
- [ ] Verify User B cannot see User A's documents

#### Test 5.3: Direct Database Query (Bypass Attempt)

Try to access another user's data directly via SQL:

```sql
-- This should return empty results due to RLS policies
-- RLS policies automatically filter data based on auth.uid()
-- Even with an explicit WHERE clause, RLS policies override
SELECT * FROM chats WHERE user_id != auth.uid();
```

- [ ] Query returns no results (RLS filters automatically)
- [ ] RLS policies are working correctly
- [ ] Access denied errors indicate proper security

**Important**: Row Level Security (RLS) policies are applied automatically by PostgreSQL and override any WHERE conditions in your queries. Users can only see their own data regardless of what they query.

### 6. Error Handling

#### Test 6.1: Network Errors

- [ ] Disable network (DevTools → Network → Offline)
- [ ] Try to sign in
- [ ] Verify appropriate error message
- [ ] Re-enable network
- [ ] Verify can retry and succeed

#### Test 6.2: Invalid Credentials

- [ ] Set incorrect Supabase URL in `.env`
- [ ] Restart dev server
- [ ] Verify app handles gracefully
- [ ] Verify fallback to localStorage mode

#### Test 6.3: Database Errors

- [ ] Temporarily disable Supabase project
- [ ] Try to create chat
- [ ] Verify error is caught and logged
- [ ] Verify app doesn't crash

### 7. Performance

#### Test 7.1: Load Time

- [ ] Clear cache and reload
- [ ] Measure time to initial render
- [ ] Should be < 3 seconds on good connection

#### Test 7.2: Large Chat History

- [ ] Create chat with 100+ messages
- [ ] Verify scrolling is smooth
- [ ] Verify no memory leaks
- [ ] Check Chrome DevTools → Performance

#### Test 7.3: Many Documents (RAG)

- [ ] Upload 50+ documents via RAG Manager
- [ ] Test vector search performance
- [ ] Should return results in < 1 second

### 8. Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

For each browser, verify:
- [ ] Authentication works
- [ ] Chat interface renders correctly
- [ ] Database operations succeed
- [ ] No console errors

### 9. Mobile Responsiveness

On mobile device or using DevTools device emulation:

- [ ] Login screen is readable
- [ ] Chat interface adapts to screen size
- [ ] Sidebar can be toggled
- [ ] Message input is accessible
- [ ] Send button is easy to tap

### 10. Integration Testing

#### Test 10.1: Full User Journey

Complete workflow from start to finish:

1. [ ] Open app (not authenticated)
2. [ ] Sign in with GitHub
3. [ ] Create new chat
4. [ ] Send multiple messages
5. [ ] Upload RAG document
6. [ ] Send message referencing uploaded content
7. [ ] Create second chat
8. [ ] Switch between chats
9. [ ] Delete first chat
10. [ ] Sign out
11. [ ] Sign back in
12. [ ] Verify all data persists

## Debugging Tips

### Check Browser Console

Look for:
- Supabase connection errors
- Authentication state logs
- API request failures
- React component errors

### Check Supabase Dashboard

- **Logs**: Check for API errors
- **Database**: Verify data is being saved
- **Auth**: Check active sessions
- **Storage**: Monitor storage usage

### Check Network Tab

- Verify API calls to Supabase
- Check OAuth redirects
- Look for failed requests

### Common Issues

1. **"Session not found"**
   - Clear localStorage and cookies
   - Try incognito mode
   - Check Supabase URL is correct

2. **"RLS policy error"**
   - Verify migration ran successfully
   - Check user is authenticated
   - Verify user ID matches

3. **"Embedding generation failed"**
   - Check OpenAI API key
   - Verify API quota
   - Check network connectivity

4. **OAuth redirect loop**
   - Verify callback URL in Supabase
   - Check for CORS issues
   - Clear browser cache

## Automated Testing

For CI/CD pipelines:

```bash
# Run all tests (combines linting, validation, and building - may take 3-5 minutes)
npm run test:quality

# Individual tests for faster debugging:
npm run lint         # ESLint checking (~30 seconds)
npm run build        # TypeScript compilation and Vite build (~1-2 minutes)
npm run validate:all # Custom validations (~30 seconds)
```

## Performance Benchmarks

Expected performance:

| Metric | Target | Acceptable |
|--------|--------|------------|
| Initial Load | < 2s | < 3s |
| Authentication | < 3s | < 5s |
| Create Chat | < 500ms | < 1s |
| Send Message | < 1s | < 2s |
| Load History | < 1s | < 2s |
| RAG Upload | < 3s | < 5s |
| Vector Search | < 500ms | < 1s |

## Security Testing

### Authentication Security

- [ ] Cannot access app without authentication
- [ ] Session tokens are not exposed in URLs
- [ ] Tokens are stored securely (httpOnly if possible)
- [ ] Session timeout works correctly

### Data Security

- [ ] Users cannot access other users' data
- [ ] API keys are not exposed in client code
- [ ] Environment variables are not in git
- [ ] Database queries are parameterized

## Reporting Issues

When reporting bugs, include:

1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Network requests (if relevant)
6. Supabase logs (if available)

## Next Steps

After successful testing:

1. Update documentation with any findings
2. Address any bugs discovered
3. Optimize performance bottlenecks
4. Add additional tests as needed
5. Prepare for production deployment

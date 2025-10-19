# Quick Start Guide - Pilot Server

Get up and running with the new VS Code-style authentication and Supabase integration in 10 minutes.

## 🚀 Fast Track Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server

# Install dependencies
npm install
```

### Step 2: Create Supabase Project (3 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: pilot-server
   - **Password**: (choose a strong password)
   - **Region**: (closest to you)
4. Click "Create new project"
5. Wait for setup (~2 minutes)

### Step 3: Configure Authentication (2 minutes)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** and toggle it ON
3. Create GitHub OAuth App:
   - Go to [github.com/settings/developers](https://github.com/settings/developers)
   - Click "New OAuth App"
   - **Homepage URL**: `http://localhost:4173`
   - **Callback URL**: Copy from Supabase (format: `https://xxx.supabase.co/auth/v1/callback`)
4. Copy Client ID and Client Secret to Supabase
5. Click "Save"

### Step 4: Set Up Database (1 minute)

1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify: Go to **Table Editor** - you should see 4 new tables

### Step 5: Configure Environment (1 minute)

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your favorite editor
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_OPENAI_API_KEY=sk-xxx  # Optional for now
```

**Where to find these:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" → `VITE_SUPABASE_URL`
- Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

### Step 6: Start Development Server (1 minute)

```bash
npm run dev
```

Open http://localhost:4173 in your browser.

## ✅ Verify Everything Works

### Test 1: Authentication
1. Click "Sign in with GitHub"
2. Authorize the app
3. You should be redirected back and logged in
4. ✅ You see the chat interface

### Test 2: Database
1. Create a new chat
2. Send a message
3. Refresh the page
4. ✅ Chat and messages are still there

### Test 3: Supabase Tables
1. Go to Supabase → Table Editor
2. Click `user_profiles` - you should see your profile
3. Click `chats` - you should see your chat
4. Click `chat_messages` - you should see your messages
5. ✅ All data is in the database

## 🎉 You're Ready!

You now have:
- ✅ VS Code-style GitHub authentication
- ✅ Persistent database storage
- ✅ Row-level security
- ✅ Ready for RAG (when you add OpenAI key)

## 🔄 Optional: Enable RAG

To enable Retrieval-Augmented Generation:

1. Get OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add to `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-xxx
   ```
3. Enable pgvector extension:
   - Supabase → Database → Extensions
   - Search for "vector"
   - Enable it
4. Restart your dev server

## 📚 Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
- Check [TESTING.md](./TESTING.md) for comprehensive testing
- See [MIGRATION.md](./MIGRATION.md) if upgrading from old version

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env` file has correct URL and key
- Verify Supabase project is running (check dashboard)

### "OAuth redirect failed"
- Verify callback URL in GitHub OAuth app matches Supabase
- Check GitHub OAuth app is active

### "Database error"
- Verify migration ran successfully
- Check Supabase → SQL Editor for errors
- Ensure all 4 tables exist

### "Build failed"
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Still stuck?
1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Open an issue on GitHub with details

## 🚢 Deploy to GitHub Pages

When you're ready to deploy:

1. Update repository settings
2. Enable GitHub Pages
3. Set source to "GitHub Actions"
4. Push to main branch
5. Workflow in `.github/workflows/deploy.yml` handles deployment

Note: Update Supabase callback URL to your production URL.

## 💡 Tips

- Use browser DevTools to inspect Supabase requests
- Check Supabase Dashboard → Logs for API errors
- Enable verbose logging in development for debugging
- Use the RAG Manager component to test vector search

Enjoy building with Pilot Server! 🎨

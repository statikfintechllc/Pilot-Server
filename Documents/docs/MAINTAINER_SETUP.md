# Repository Maintainer Guide - One-Time Setup

This guide is for repository maintainers who want to enable database features for all users via GitHub Pages deployment.

## Overview

By doing this **one-time setup**, all users can:
- Visit the GitHub Pages URL
- Sign in with GitHub
- Get automatic database sync
- No individual configuration needed

## Setup Steps (Do Once)

### 1. Create Shared Supabase Project

```bash
# Go to https://supabase.com
# Click "New Project"

Name: pilot-server-shared
Database Password: [choose strong password - save securely]
Region: [closest to your users]

# Wait ~2 minutes for setup
```

### 2. Enable GitHub OAuth

```bash
# In Supabase Dashboard:
# Authentication → Providers → GitHub

Toggle: Enable GitHub Provider

# Click "GitHub" to configure
```

#### Create GitHub OAuth App:

```bash
# Go to: https://github.com/settings/developers
# Click: "New OAuth App"

Application name: Pilot Server
Homepage URL: https://statikfintechllc.github.io/Pilot-Server
Authorization callback URL: https://xxxxx.supabase.co/auth/v1/callback
                            # ^ Get this from Supabase (copy exact URL)

# Click "Register application"
# Copy the Client ID
# Click "Generate a new client secret"
# Copy the Client Secret
```

#### Configure in Supabase:

```bash
# Back in Supabase GitHub Provider settings:

GitHub Client ID: [paste from GitHub]
GitHub Client Secret: [paste from GitHub]

# IMPORTANT: Add ALL callback URLs users might use:
# Site URL: https://statikfintechllc.github.io/Pilot-Server
# Additional Redirect URLs (add each):
  - http://localhost:4173/auth/callback
  - http://localhost:5173/auth/callback
  - http://localhost:3000/auth/callback
  - https://statikfintechllc.github.io/Pilot-Server/auth/callback

# Click "Save"
```

### 3. Run Database Migration

```bash
# In Supabase Dashboard:
# SQL Editor → New query

# Copy entire contents of:
# supabase/migrations/001_initial_schema.sql

# Paste into SQL Editor
# Click "Run" (or Cmd/Ctrl + Enter)

# Verify success:
# Table Editor should now show:
#   - user_profiles
#   - chats
#   - chat_messages
#   - document_embeddings
```

### 4. Get Supabase Credentials

```bash
# In Supabase Dashboard:
# Settings → API

Copy these values:
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Also recommended (optional):
service_role key: [for admin operations if needed]
```

### 5. Add GitHub Repository Secrets

```bash
# In your GitHub repo:
# Settings → Secrets and variables → Actions
# Click "New repository secret"

Add three secrets:

Name: VITE_SUPABASE_URL
Value: https://xxxxx.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: VITE_OPENAI_API_KEY (Optional - for RAG)
Value: sk-...
```

### 6. Verify GitHub Actions Workflow

The workflow should already be configured. Verify it has:

```yaml
# .github/workflows/deploy.yml

- name: Build application
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
  run: npm run build
```

### 7. Enable GitHub Pages

```bash
# In GitHub repo:
# Settings → Pages

Source: GitHub Actions
# (This should already be set if workflow exists)

# Note the deployed URL:
# https://statikfintechllc.github.io/Pilot-Server
```

### 8. Deploy

```bash
# Push to main branch:
git push origin main

# GitHub Actions will:
1. Install dependencies
2. Build with secrets as environment variables
3. Deploy to GitHub Pages

# Check Actions tab for progress
# Should complete in 2-3 minutes
```

### 9. Test Deployment

```bash
# Visit deployed URL:
https://statikfintechllc.github.io/Pilot-Server

# Should see:
1. App loads without errors
2. Console shows: "🚀 Pilot Server: Running with Supabase backend"
3. Can click "Sign in with GitHub"
4. After sign-in, can create chats
5. Chat persists after refresh

# Test in Supabase:
# Table Editor → user_profiles
# Should see your user after signing in

# Table Editor → chats
# Should see chats you created
```

## Maintenance

### Monitoring Usage

```bash
# Supabase Dashboard:
# Statistics → Overview

Check:
- Active users
- Database size
- API requests
- Bandwidth usage

# Free tier limits:
- 50,000 monthly active users
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly edge function invocations
```

### Updating Secrets

```bash
# If you need to rotate credentials:

# 1. Generate new Supabase project/keys
# 2. Update GitHub Secrets
# 3. Push to trigger rebuild
# 4. Old deployments continue working until rebuild
```

### Adding New Domains

```bash
# If users deploy to custom domains:

# 1. Add to Supabase:
# Authentication → URL Configuration → Redirect URLs
# Add: https://customdomain.com/auth/callback

# 2. Add to GitHub OAuth App:
# GitHub Settings → OAuth Apps → Your App
# Add to callback URLs
```

## For Users

Once you complete this setup, share with users:

```markdown
## Using Pilot Server

**Option 1: GitHub Pages (Recommended)**
Visit: https://statikfintechllc.github.io/Pilot-Server
Click "Sign in with GitHub"
Start chatting!

**Option 2: Local Development**
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server
npm install && npm run dev
```

Users need **zero configuration** - everything works automatically!

## Security Notes

**Supabase Anon Key:**
- ✅ Safe to expose in client code
- ✅ Protected by Row Level Security (RLS)
- ✅ Users can only access their own data
- ✅ No admin privileges

**OpenAI Key:**
- ⚠️ Current implementation: client-side (for demo)
- 🔒 Production: Move to Supabase Edge Functions
- 💰 Consider: Rate limiting, spending caps

**GitHub OAuth:**
- ✅ Fully handled by Supabase
- ✅ No secrets in client code
- ✅ Secure token exchange

## Cost Estimates

**Supabase Free Tier:**
- Good for: 50,000 users
- Database: 500 MB (plenty for chat history)
- Bandwidth: 2 GB/month
- Cost: $0

**When to Upgrade:**
- More than 50,000 monthly active users
- Need more than 500 MB storage
- Exceed bandwidth limits
- Want guaranteed uptime SLA

**Pro Tier:** $25/month
- 100,000 monthly active users
- 8 GB database
- 50 GB bandwidth

**OpenAI Costs (if used):**
- Embeddings: ~$0.0001 per 1K tokens
- For 1000 documents: ~$0.10
- Set spending limits in OpenAI dashboard

## Troubleshooting

**Build fails in GitHub Actions:**
```bash
Check: Actions tab for error details
Common: Secrets not set correctly
Fix: Verify all three secrets exist
```

**Auth not working:**
```bash
Check: Supabase allowed redirect URLs
Fix: Add deployment URL to list
```

**Database not syncing:**
```bash
Check: Supabase credentials correct
Fix: Regenerate and update secrets
```

**OpenAI RAG not working:**
```bash
Check: VITE_OPENAI_API_KEY secret set
Fix: Add OpenAI API key to secrets
```

## Questions?

- **Documentation**: See `docs/PLUG_AND_PLAY.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Testing**: See `docs/TESTING.md`
- **Issues**: Open GitHub issue

---

**Result:** A truly shared infrastructure where:
- ✅ You configure once
- ✅ All users benefit
- ✅ Zero per-user setup
- ✅ Works from any domain
- ✅ Scales automatically

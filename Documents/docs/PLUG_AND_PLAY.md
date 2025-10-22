# Plug and Play Deployment Guide

This guide shows how to deploy Pilot Server for **immediate use** without manual configuration.

## 🚀 Quick Start Options

### Option 1: Instant Demo (No Setup Required)

Clone and run immediately with localStorage:

```bash
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server
npm install
npm run dev
```

**Features Available:**
- ✅ Full chat interface
- ✅ All AI models
- ✅ Chat history (persists in browser)
- ✅ Works completely offline after first load
- ⚠️ No cross-device sync (localStorage only)
- ⚠️ No RAG features (requires OpenAI key)

**Perfect for:** Testing, development, personal use

### Option 2: Shared Supabase Instance (Recommended)

Use a pre-configured Supabase instance shared across all deployments.

#### For Repository Owners:

1. **One-Time Setup** (Do this once for all users):

```bash
# Create a Supabase project
# Go to https://supabase.com → New Project
# Name: pilot-server-shared
# Region: Choose based on your users

# Enable GitHub OAuth
# Authentication → Providers → GitHub → Enable
# Add ALL possible callback URLs:
#   - http://localhost:4173/auth/callback
#   - http://localhost:5173/auth/callback
#   - https://statikfintechllc.github.io/Pilot-Server/auth/callback
#   - https://yourdomain.com/auth/callback

# Run database migration
# SQL Editor → Run supabase/migrations/001_initial_schema.sql

# Get credentials
# Settings → API
# Copy: Project URL and anon/public key
```

2. **Configure Repository Secrets** (GitHub Pages auto-deploy):

```bash
# Go to repo Settings → Secrets and variables → Actions
# Add these secrets:

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_OPENAI_API_KEY=sk-xxx  # Optional, for RAG
```

3. **Create `.env` file** (for local development):

```bash
# Add to .env (DO NOT COMMIT THIS FILE)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_OPENAI_API_KEY=sk-xxx
```

4. **Update GitHub Actions Workflow**:

```yaml
# .github/workflows/deploy.yml
# Add environment variables to build step:

- name: Build application
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
  run: npm run build
```

#### For All Users:

Once configured, users can:

```bash
# Clone and run
git clone https://github.com/statikfintechllc/Pilot-Server.git
cd Pilot-Server
npm install
npm run dev

# OR visit GitHub Pages
https://statikfintechllc.github.io/Pilot-Server

# OR add to home screen (PWA)
Visit site → Share → Add to Home Screen
```

**Features Available:**
- ✅ Full chat interface
- ✅ All AI models
- ✅ Cross-device chat sync
- ✅ Persistent database storage
- ✅ RAG features (if OpenAI key configured)
- ✅ Works from anywhere (GitHub Pages, localhost, custom domain)

### Option 3: Fork and Deploy Your Own

Fork the repository and deploy to your own hosting:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Pilot-Server.git
cd Pilot-Server

# 3. Create your own Supabase project (see Option 2)

# 4. Add your credentials to .env
cp .env.example .env
# Edit .env with your credentials

# 5. Deploy anywhere
npm run build
# Upload dist/ to any static host (Netlify, Vercel, Cloudflare Pages, etc.)
```

## 🔧 Configuration Modes

The app automatically detects configuration and runs in the appropriate mode:

### Mode 1: localStorage Only (Default)
- No `.env` file or credentials needed
- Chat history stored in browser
- Works completely offline
- Perfect for quick testing

### Mode 2: Supabase Enabled
- Credentials detected automatically
- Database storage enabled
- Cross-device sync
- Multi-user support

### Mode 3: Full Features (Supabase + OpenAI)
- All database features
- RAG system active
- Context-aware responses
- Full production capabilities

## 🌐 Multi-Domain Support

The shared Supabase instance supports multiple domains:

**Development:**
- http://localhost:4173
- http://localhost:5173
- http://127.0.0.1:4173

**Production:**
- https://statikfintechllc.github.io/Pilot-Server
- https://yourdomain.com
- Any custom domain

**GitHub OAuth Callback URLs:**
All domains must be added to your GitHub OAuth app:
```
http://localhost:4173/auth/callback
http://localhost:5173/auth/callback
https://statikfintechllc.github.io/Pilot-Server/auth/callback
https://yourdomain.com/auth/callback
```

## 📱 PWA / Add to Home Screen

Once deployed, users can add the app to their home screen:

**iOS (Safari):**
1. Open the deployed site
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the deployed site
2. Tap the three dots menu
3. Tap "Add to Home Screen"
4. Tap "Add"

**Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install"

The app will work like a native app with offline support!

## 🔒 Security Considerations

**Supabase Anon Key:**
- ✅ Safe to expose in client code
- ✅ Protected by Row Level Security (RLS)
- ✅ Users can only access their own data

**OpenAI Key:**
- ⚠️ Should ideally be server-side
- 📝 For production, move to Supabase Edge Functions
- 🔒 Current implementation is for development/demo

**GitHub OAuth:**
- ✅ Handled entirely by Supabase
- ✅ No secrets in client code
- ✅ Secure token exchange

## 📊 Usage Monitoring

**For Supabase:**
- Dashboard → Statistics
- Monitor active users
- Track database usage
- Check API quota

**For OpenAI:**
- Platform Dashboard
- Monitor API usage
- Set spending limits
- Track embeddings generated

## 🆘 Troubleshooting

### "localStorage mode" message appears
**Cause:** No Supabase credentials configured
**Fix:** Either:
- Use app in localStorage mode (works fine!)
- Or add credentials to enable database features

### Authentication fails
**Cause:** Callback URL not in GitHub OAuth app
**Fix:** Add the current domain to GitHub OAuth callback URLs

### Database not syncing
**Cause:** Supabase credentials incorrect
**Fix:** Verify credentials in Settings → API

### Build fails in GitHub Actions
**Cause:** Repository secrets not set
**Fix:** Add secrets in repo Settings → Secrets and variables

## 🎯 Deployment Checklist

### For Repository Maintainers:

- [ ] Create shared Supabase project
- [ ] Enable GitHub OAuth with all callback URLs
- [ ] Run database migration
- [ ] Add repository secrets
- [ ] Update GitHub Actions workflow
- [ ] Test deployment to GitHub Pages
- [ ] Verify auth works from all domains
- [ ] Update README with live demo link

### For Users:

- [ ] Clone or fork repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Visit app in browser
- [ ] Sign in with GitHub
- [ ] Test chat functionality
- [ ] (Optional) Add to home screen

## 🚀 Production Deployment

### GitHub Pages (Automatic)

Push to main branch → GitHub Actions deploys automatically

### Custom Domain

1. Deploy to any static host
2. Add domain to GitHub OAuth app callbacks
3. Update Supabase allowed redirect URLs (if needed)
4. Configure DNS

### Netlify / Vercel / Cloudflare Pages

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables (if using shared instance)
5. Deploy!

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Guide](https://pages.github.com/)

## 💡 Pro Tips

1. **Hybrid Deployment**: Keep localStorage mode for demos, Supabase for production
2. **Cost Management**: Supabase free tier supports 50,000 users
3. **OpenAI Costs**: Consider rate limiting or moving to Edge Functions
4. **Monitoring**: Set up alerts in Supabase for quota warnings
5. **Backups**: Regular database backups via Supabase dashboard

---

**Result:** A truly plug-and-play system where:
- ✅ Developers: Clone, install, run
- ✅ Users: Visit URL, sign in, chat
- ✅ No manual configuration required
- ✅ Works from any domain
- ✅ Scales automatically

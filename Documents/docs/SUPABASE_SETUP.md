# Supabase Setup Guide for Pilot Server

This guide will help you set up Supabase for the Pilot Server application, including authentication, database, and RAG functionality.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A GitHub OAuth App (for authentication)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Pilot Server
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select the region closest to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Enable GitHub Authentication

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** in the list and click to expand
3. Toggle **Enable GitHub provider** to ON
4. You'll need to create a GitHub OAuth App:

### Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Pilot Server
   - **Homepage URL**: Your app URL (e.g., `https://yourusername.github.io/Pilot-Server`)
   - **Authorization callback URL**: Copy this from Supabase (format: `https://your-project.supabase.co/auth/v1/callback`)
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### Configure in Supabase

1. Back in Supabase, paste the GitHub **Client ID** and **Client Secret**
2. Click "Save"

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" to execute the migration

This will create:
- `user_profiles` table for user data
- `chats` table for chat conversations
- `chat_messages` table for individual messages
- `document_embeddings` table for RAG functionality
- All necessary indexes and Row Level Security policies

## Step 4: Enable pgvector Extension

The RAG functionality requires the pgvector extension for vector similarity search:

1. In your Supabase dashboard, go to **Database** → **Extensions**
2. Search for "vector"
3. Enable the **vector** extension

## Step 5: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration (for RAG embeddings)
VITE_OPENAI_API_KEY=your-openai-api-key

# GitHub OAuth (optional - already configured in Supabase)
VITE_GITHUB_CLIENT_ID=your-github-oauth-client-id
```

### Finding Your Supabase Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** (use for `VITE_SUPABASE_URL`)
3. Copy the **anon/public** key (use for `VITE_SUPABASE_ANON_KEY`)

**Important**: The `anon` key is safe to use in the browser because Row Level Security (RLS) policies protect your data.

## Step 6: Test the Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and test:
   - Click "Sign in with GitHub"
   - Complete the OAuth flow
   - Verify that your user profile is created in the `user_profiles` table
   - Create a chat and send messages
   - Check that data appears in the database

## Step 7: Verify Database Tables

1. In Supabase, go to **Table Editor**
2. You should see the following tables:
   - `user_profiles`
   - `chats`
   - `chat_messages`
   - `document_embeddings`

3. Check that RLS is enabled (shield icon should be visible)

## Optional: Configure RAG (Retrieval-Augmented Generation)

To use RAG features, you need an OpenAI API key:

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file as `VITE_OPENAI_API_KEY`

**Note**: Embedding generation in the browser is for development only. For production, move this to a secure backend.

## Deployment to GitHub Pages

For static deployment (GitHub Pages), the authentication flow works seamlessly because:

1. Supabase handles all OAuth redirects
2. No backend server is required
3. All API calls go directly to Supabase (protected by RLS)

### GitHub Pages Configuration

1. In your repository settings, go to **Pages**
2. Set source to "GitHub Actions"
3. The workflow in `.github/workflows/deploy.yml` will handle deployment

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Use Supabase RLS** - All tables have RLS policies enabled
3. **Rotate secrets regularly** - Update OAuth credentials periodically
4. **Monitor usage** - Check Supabase dashboard for unusual activity

## Troubleshooting

### Authentication Issues

- Verify GitHub OAuth callback URL matches Supabase
- Check browser console for errors
- Ensure cookies are enabled

### Database Errors

- Verify RLS policies are correctly set
- Check that pgvector extension is enabled
- Review SQL migration logs for errors

### RAG Not Working

- Verify OpenAI API key is valid
- Check that pgvector extension is enabled
- Ensure embeddings table has data

## Support

For issues specific to:
- Supabase: https://supabase.com/docs
- GitHub OAuth: https://docs.github.com/en/developers/apps
- OpenAI API: https://platform.openai.com/docs

For Pilot Server issues, open an issue on GitHub.

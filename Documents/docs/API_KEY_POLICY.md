# API Key Policy - User-Controlled API Keys

## Overview

All users (maintainers and regular users alike) can add and manage their own API keys for AI providers. When users provide their own API keys, they **only pay for storage** - there is no API usage markup.

## Key Benefits

### For Users with Their Own API Keys

✅ **$0 API Markup** - Pay AI providers directly at their base rates
✅ **Storage-Only Billing** - Your sponsorship tier covers database costs only  
✅ **Full Control** - Manage your own usage and billing with providers
✅ **Maximum Privacy** - Keys stored locally in browser, never on our servers
✅ **Cost Transparency** - See exact costs from providers with no middleman fees

### Cost Comparison

**Without Your Own API Keys:**
- Base provider cost + 3-5% markup
- Example: OpenAI GPT-4 input $10/M → $10.30/M (3% markup)

**With Your Own API Keys:**
- Direct provider cost (no markup)
- Example: OpenAI GPT-4 input $10/M → $10.00/M (0% markup)
- You save the 3-5% on every API call!

## How It Works

### 1. Add Your API Keys

1. Open Settings (gear icon)
2. Go to "Developer" tab
3. Select provider from dropdown
4. Enter your API key
5. Click "Add"

### 2. What You Pay

**Free Tier ($0/month):**
- With own keys: localStorage + direct AI provider billing
- Without keys: localStorage only

**Supporter Tier ($5/month):**
- With own keys: 1 GB database + direct AI provider billing
- Without keys: 1 GB database + 3-5% markup on AI calls

**Pro Tier ($10/month):**
- With own keys: 5 GB database + RAG + direct AI provider billing
- Without keys: 5 GB + RAG + 3-5% markup on AI calls

**Power Tier ($25/month):**
- With own keys: 20 GB database + all features + direct AI provider billing
- Without keys: 20 GB + all features + 3-5% markup on AI calls

### 3. Security Model

**Local Storage Only:**
- API keys stored in browser localStorage
- Never transmitted to application servers
- Direct authentication with AI providers
- No proxy or middleman for API calls

**User Control:**
- You manage your own API keys
- You set usage limits with providers
- You monitor your own costs
- You can revoke keys at any time

## Supported Providers

Users can add keys for:

- ✅ **OpenAI** - GPT-4, GPT-3.5 Turbo
- ✅ **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus
- ✅ **xAI** - Grok models
- ✅ **Google AI** - Gemini Pro, Gemini Ultra
- 🔄 **More providers** coming soon (Cohere, Mistral, Perplexity)

## Sponsorship Tier Breakdown

### What Your Sponsorship Covers

**All Tiers:**
- Infrastructure and CDN
- Development and support
- New feature development
- Security and compliance

**Supporter+ Tiers:**
- Database hosting (~$0.50/user/month)
- Data backup and redundancy

**Pro+ Tiers:**
- RAG embeddings (~$1-3/user/month)
- Vector search infrastructure

**Note:** These costs are for infrastructure and database **only**. API calls to AI providers are either:
1. **Your own keys** → Direct billing from provider (no markup)
2. **No keys** → Our keys with 3-5% markup to cover API management overhead

## Migration Path

### Currently Using Our API Keys

1. Create accounts with AI providers (OpenAI, Anthropic, etc.)
2. Generate API keys from provider dashboards
3. Add keys to Pilot Server via Developer Settings
4. Start saving 3-5% on every API call!

### Starting Fresh

1. Choose your sponsorship tier (or start with Free)
2. Add your own API keys for providers you want to use
3. Only pay for database storage (if using paid tiers)
4. Direct billing from AI providers

## Cost Examples

### Example 1: Light User with Own Keys

**Usage:**
- 10M input tokens/month (GPT-4)
- 2M output tokens/month (GPT-4)

**Costs:**
- OpenAI direct: $10 × 0.01 + $30 × 0.002 = $0.16/month
- Pilot Server (Pro tier): $10/month
- **Total: $10.16/month**

**Same usage without own keys:**
- Pilot Server (Pro tier): $10/month
- API costs with 3% markup: $0.16 × 1.03 = $0.165/month
- **Total: $10.165/month** (tiny difference at this scale)

### Example 2: Heavy User with Own Keys

**Usage:**
- 500M input tokens/month (GPT-4)
- 100M output tokens/month (GPT-4)

**Costs:**
- OpenAI direct: $10 × 0.5 + $30 × 0.1 = $8.00/month
- Pilot Server (Pro tier): $10/month
- **Total: $18.00/month**

**Same usage without own keys:**
- Pilot Server (Pro tier): $10/month
- API costs with 3% markup: $8.00 × 1.03 = $8.24/month
- **Total: $18.24/month** 
- **Savings with own keys: $0.24/month** (3% of API costs)

### Example 3: Enterprise User with Own Keys

**Usage:**
- 10,000M (10B) input tokens/month
- 2,000M (2B) output tokens/month

**Costs:**
- OpenAI direct: $10 × 10 + $30 × 2 = $160/month
- Pilot Server (Power tier): $25/month
- **Total: $185/month**

**Same usage without own keys:**
- Pilot Server (Power tier): $25/month
- API costs with 3% markup: $160 × 1.03 = $164.80/month
- **Total: $189.80/month**
- **Savings with own keys: $4.80/month** (3% of API costs)

## Best Practices

### Getting Provider API Keys

**OpenAI:**
1. Visit https://platform.openai.com
2. Create account and add payment method
3. Go to API keys section
4. Generate new key
5. Copy and add to Pilot Server

**Anthropic:**
1. Visit https://console.anthropic.com
2. Sign up and verify email
3. Navigate to API keys
4. Create new key
5. Copy and add to Pilot Server

**xAI:**
1. Visit https://console.x.ai
2. Create account
3. Request API access
4. Generate key once approved
5. Copy and add to Pilot Server

**Google AI:**
1. Visit https://ai.google.dev
2. Get started with Gemini API
3. Create project and enable API
4. Generate API key
5. Copy and add to Pilot Server

### Security Tips

✅ **Do:**
- Use unique API keys for each application
- Set usage limits with providers
- Monitor costs in provider dashboards
- Revoke keys if compromised
- Keep keys secure and private

❌ **Don't:**
- Share API keys with others
- Commit keys to public repositories
- Use same key across multiple apps
- Ignore usage alerts from providers
- Use keys without monitoring costs

## FAQ

### Q: Do I have to add my own API keys?

**A:** No! You can use the platform without providing any API keys. We'll handle the API calls with our keys and add a small 3-5% markup. Your own keys are optional but save you that markup.

### Q: What happens if I don't add API keys?

**A:** The app works perfectly fine. We'll use our API keys and add a 3-5% markup to cover API management overhead. This is still very competitive!

### Q: Can I switch between my keys and your keys?

**A:** Yes! You can add or remove your API keys at any time. When you have keys configured, they're used automatically. Remove them to fall back to our managed API service.

### Q: Are my API keys secure?

**A:** Yes! Your keys are stored only in your browser's localStorage and never transmitted to our servers. All API calls go directly from your browser to the AI provider.

### Q: What if a provider changes their pricing?

**A:** If you use your own keys, you pay the provider's current rates directly. If you use our keys, we may adjust the markup to maintain sustainability, but we'll always communicate changes in advance.

### Q: Can maintainers see my API keys?

**A:** Absolutely not! Your API keys are stored locally in your browser and are never accessible to maintainers, our servers, or anyone else. This is by design for maximum security and privacy.

### Q: Do different sponsorship tiers require different API keys?

**A:** No! Your API keys work the same across all tiers. The tier only affects database storage and features like RAG. Free tier users can add API keys too!

### Q: What about rate limits?

**A:** Rate limits are set by the AI provider and apply to your API key. Using your own keys means you have full control over rate limits based on your provider account tier.

## Support

For questions about:
- **API key setup:** See provider documentation (links above)
- **Billing and costs:** Contact the AI provider directly
- **Pilot Server tiers:** See docs/SPONSORSHIP_SYSTEM.md
- **Technical issues:** Open a GitHub issue

## Summary

🎯 **The Choice is Yours:**
- Want maximum control and savings? → Add your own API keys
- Want simple managed service? → Use our keys with small markup
- Want to switch? → Add/remove keys anytime

Either way, you only pay for the database storage and features you need. No hidden fees, no surprises, complete transparency!

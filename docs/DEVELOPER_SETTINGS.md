# Developer Settings Guide

## Overview

The Developer Settings panel provides a comprehensive interface for managing API keys, configuring AI providers, viewing transparent pricing, and requesting new models. 

**⚠️ Important: Access Level Depends on Your Role**

- **Maintainers** (repository owners/core developers): Full developer settings with all 4 tabs
- **Regular Users**: Simplified "Usage & Tiers" panel with upgrade options and provider requests

See [ROLE_BASED_ACCESS.md](./ROLE_BASED_ACCESS.md) for complete details on the role system.

## Accessing Developer Settings

1. Click the **gear icon (⚙️)** in the top-right corner of the app
2. Navigate to the **"Developer"** tab
3. **Maintainers** will see four sub-tabs: API Keys, Providers, Pricing, and Request Model
4. **Regular Users** will see a simplified Usage & Tiers interface

## For Regular Users: Usage & Tiers Panel

If you're a regular user (not a repository maintainer), you'll see a simplified interface with the following sections:

### Your Current Tier
- Displays your active sponsorship tier (Free, Supporter, Pro, or Power)
- Shows monthly cost and included features
- Lists all features available at your tier level

### Upgrade Options
- View all available sponsorship tiers
- See storage quotas and features for each tier
- Direct link to GitHub Sponsors to upgrade

### Transparent Pricing
- Breakdown of what your sponsorship covers:
  - Database hosting costs
  - OpenAI API costs for RAG
  - Infrastructure and CDN
  - Development and support
- Information about AI provider costs and markup

### Request New AI Provider
- Submit requests for new AI models via email
- Maintainers review and assess feasibility
- Cost impact and tier requirements communicated

**Note:** Regular users cannot add API keys directly. This is by design to maintain security and cost control. All AI provider access is managed through the sponsorship tier system.

---

## For Maintainers: Full Developer Settings

The following sections are available only to repository maintainers with full access.

### 1. API Key Management (Maintainers Only)

**Purpose:** Store and manage API keys for different AI providers locally in your browser.

**How to Add an API Key:**
1. Go to **API Keys** tab
2. Select a provider from the dropdown (OpenAI, Anthropic, xAI, Google AI)
3. Paste your API key
4. Click **"Add"**

**Security:**
- API keys are stored locally in your browser (localStorage)
- Keys never leave your device or sent to our servers
- Keys are only used to authenticate directly with the AI provider
- You can show/hide keys using the eye icon
- Remove keys anytime by clicking "Remove"

**Supported Providers:**
- **OpenAI** - GPT-4, GPT-3.5, and other OpenAI models
- **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus
- **xAI** - Grok models by Elon Musk's xAI
- **Google AI** - Gemini Pro, Gemini Ultra

### 2. Provider Directory

**Purpose:** View all available and upcoming AI providers with their status and requirements.

**Information Displayed:**
- Provider name and description
- Availability status (Available / Coming Soon)
- Required sponsorship tier
- Official website link
- Base token costs (input/output per million tokens)
- Developer markup percentage

**Provider Status:**
- ✅ **Available** - Provider is integrated and ready to use
- **Coming Soon** - Provider is planned but not yet integrated
- **Configured** badge - You have an API key saved for this provider

### 3. Transparent Pricing

**Purpose:** View live token costs with complete transparency on developer markup.

**What You See:**
- **Base Cost** - What the AI provider charges
- **Markup** - Our 3-5% fee to cover infrastructure
- **Your Cost** - Total cost per million tokens (Base × (1 + Markup%))
- **Example Calculations** - Real-world cost examples

**Pricing Formula:**
```
User Cost = Provider Cost × (1 + Markup%)

Example (OpenAI with 3% markup):
- Input: $10/M × 1.03 = $10.30/M tokens
- Output: $30/M × 1.03 = $30.90/M tokens
```

**Tier Adjustments:**
- **Supporter ($5/mo):** Baseline pricing
- **Pro ($10/mo):** +$10-20 for high-cost models
- **Power ($25/mo):** +$30-40 for premium models

**Why Markup?**
The 3-5% markup covers:
- Infrastructure and hosting costs
- Database storage (Supabase)
- Development and maintenance
- Support and monitoring

### 4. Request New Models

**Purpose:** Request support for AI models or providers not currently available.

**How to Submit a Request:**
1. Go to **Request Model** tab
2. Fill in the form:
   - **Provider/Company** - Name of AI company (e.g., "Cohere", "Mistral AI")
   - **Model Name** - Specific model you want (e.g., "Command R+", "Mistral Large")
   - **Your Use Case** - Explain how you'd use this model
   - **Estimated Usage** - Monthly token volume (Light/Moderate/Heavy/Enterprise)
   - **Email** - For updates on your request
3. Click **"Submit Request"**

**Evaluation Criteria:**
We assess each request based on:
- **API Costs** - Provider's token pricing and markup needed
- **Demand** - How many users want this model
- **Technical Complexity** - Integration difficulty and maintenance
- **Sponsorship Tier** - Which tier can support the costs sustainably

**Timeline:**
- Requests reviewed weekly
- High-demand, low-cost models prioritized
- You'll receive email updates on status
- Implementation typically takes 2-4 weeks

## Environment Variables

Some configuration is done via environment variables at build time:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (optional - can also use UI)
VITE_OPENAI_API_KEY=your_openai_api_key
```

**Note:** Environment variables are set during build and cannot be changed at runtime. Use the UI for keys that you want to change dynamically.

## Best Practices

### API Key Security

1. **Never Share Keys** - Don't share screenshots showing your API keys
2. **Use API Key Permissions** - Set provider API keys to minimum required permissions
3. **Rotate Regularly** - Change keys periodically for security
4. **Monitor Usage** - Check provider dashboards for unexpected usage

### Cost Management

1. **Start Small** - Test with light usage before scaling
2. **Monitor Costs** - Check the Pricing tab to understand costs
3. **Use Cheaper Models** - Start with GPT-3.5 or Gemini before GPT-4
4. **Set Provider Limits** - Configure spend limits in provider dashboards

### Provider Selection

1. **Match Model to Task** - Use cheaper models for simple tasks
2. **Test Multiple Providers** - Different models excel at different tasks
3. **Consider Latency** - Some providers are faster than others
4. **Check Availability** - Ensure provider supports your region

## Troubleshooting

### "API Key Invalid" Error

**Solution:**
1. Verify the key is correct (copy from provider dashboard)
2. Check if key has proper permissions
3. Ensure key isn't expired or revoked
4. Try removing and re-adding the key

### Provider Not Showing Models

**Solution:**
1. Ensure you've added an API key for that provider
2. Check if provider requires specific sponsorship tier
3. Verify provider is marked as "Available"
4. Try refreshing the page

### Pricing Seems Wrong

**Solution:**
1. Pricing updates dynamically based on provider costs
2. Check the provider's official pricing page
3. Markup is always 3-5% (shown in Pricing tab)
4. Tier adjustments apply for expensive models

### Request Not Received

**Solution:**
1. Check spam/junk folder for confirmation email
2. Verify email address was entered correctly
3. Requests stored locally - check browser localStorage
4. Re-submit if no confirmation within 48 hours

## Advanced Usage

### Custom API Endpoints

For advanced users wanting to use custom endpoints (e.g., Azure OpenAI, self-hosted models):

1. Currently not supported in UI
2. Can be configured via environment variables
3. Feature planned for future release
4. Contact support for enterprise requirements

### Bulk API Key Management

If managing keys for a team:

1. Each user manages their own keys locally
2. No central key management (by design for security)
3. Enterprise SSO/key management planned for Power+ tier
4. Consider provider's team/org features

### Usage Analytics

Track your API usage:

1. Use provider dashboards (OpenAI, Anthropic, etc.)
2. Built-in usage tracking coming soon
3. Export data from provider dashboards
4. Set up billing alerts at provider level

## FAQ

**Q: Are my API keys safe?**  
A: Yes. Keys are stored only in your browser's localStorage and never sent to our servers. They're only used to authenticate directly with AI providers.

**Q: Can I use multiple keys for the same provider?**  
A: Currently, only one key per provider is supported. This may change in future updates.

**Q: What happens if I clear my browser data?**  
A: Your API keys will be deleted. You'll need to re-enter them. Consider backing up keys securely.

**Q: Do I need API keys for GitHub models?**  
A: No. GitHub models work through GitHub authentication. API keys are only for non-GitHub providers.

**Q: Which tier do I need for each provider?**  
A: Check the Providers tab - each provider shows its required tier (Supporter/Pro/Power).

**Q: Can I request a refund if a model is too expensive?**  
A: Sponsorship tiers are monthly subscriptions. Review pricing before subscribing to higher tiers.

**Q: How often do you add new providers?**  
A: Weekly reviews of requests. High-demand, cost-effective providers added within 2-4 weeks.

**Q: Can I use my own Supabase instance?**  
A: Yes, configure via environment variables. See `docs/SUPABASE_SETUP.md` for details.

## Support

Need help?

- **GitHub Issues**: [Report bugs or issues](https://github.com/statikfintechllc/Pilot-Server/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/statikfintechllc/Pilot-Server/discussions)
- **Email**: Check your sponsorship tier for support email
- **Priority Support**: Available for Power tier sponsors

## Related Documentation

- [Quick Start Guide](QUICK_START.md)
- [Sponsorship System](SPONSORSHIP_SYSTEM.md)
- [Supabase Setup](SUPABASE_SETUP.md)
- [Architecture](ARCHITECTURE.md)

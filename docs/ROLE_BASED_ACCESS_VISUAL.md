# Role-Based Access Control: Visual Comparison

## Overview

This document provides a visual comparison of what maintainers vs regular users see when accessing the Developer tab in Settings.

## Access Badges

### Maintainer View
```
┌─────────────────────────────────────────────────┐
│ ⚙ Developer Settings    [👑 Maintainer Access] │
└─────────────────────────────────────────────────┘
```

### Regular User View
```
┌─────────────────────────────────────────────────┐
│ 🗄 Usage & Tiers         [🔒 User Access]      │
└─────────────────────────────────────────────────┘
```

---

## Full Interface Comparison

### MAINTAINER VIEW (Full Developer Settings)

```
┌──────────────────────────────────────────────────────────────┐
│  ⚙ Developer Settings              [👑 Maintainer Access]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [API Keys] [Providers] [Pricing] [Request Model]   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  📋 Tab: API Keys                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🔑 API Key Management                               │    │
│  │                                                      │    │
│  │ Configure your API keys for different AI providers  │    │
│  │ Keys are stored locally in your browser             │    │
│  │                                                      │    │
│  │ Add API Key:                                        │    │
│  │ [Select provider ▼] [Enter API key] [Add]          │    │
│  │                                                      │    │
│  │ Configured Keys:                                    │    │
│  │ • OpenAI         sk-proj-***       [👁] [Remove]   │    │
│  │ • Anthropic      sk-ant-***        [👁] [Remove]   │    │
│  │ • xAI            xai-***           [👁] [Remove]   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  📋 Tab: Providers                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🗂 Provider Directory                               │    │
│  │                                                      │    │
│  │ ✅ OpenAI                           [✓ Configured]  │    │
│  │    GPT-4, GPT-3.5 models                           │    │
│  │    💵 $10-30/M tokens • Pro tier                   │    │
│  │                                                      │    │
│  │ ✅ Anthropic                        [✓ Configured]  │    │
│  │    Claude 3.5, Claude 3 Opus                       │    │
│  │    💵 $15-75/M tokens • Pro tier                   │    │
│  │                                                      │    │
│  │ 🔄 Cohere                          [Coming Soon]    │    │
│  │    Command R+ models                               │    │
│  │    💵 $2-10/M tokens • Pro tier                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  📋 Tab: Pricing                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 💵 Transparent Pricing                              │    │
│  │                                                      │    │
│  │ Calculate costs with 3-5% markup                   │    │
│  │                                                      │    │
│  │ Provider: [OpenAI ▼]                               │    │
│  │ Model: [GPT-4 ▼]                                   │    │
│  │                                                      │    │
│  │ Input tokens: [100,000]                            │    │
│  │ Output tokens: [10,000]                            │    │
│  │                                                      │    │
│  │ Cost Breakdown:                                     │    │
│  │ • Base input:  $1.00 (100K × $10/M)                │    │
│  │ • Your input:  $1.03 (3% markup)                   │    │
│  │ • Base output: $0.30 (10K × $30/M)                 │    │
│  │ • Your output: $0.31 (3% markup)                   │    │
│  │ ─────────────────────────────────                  │    │
│  │ Total Cost: $1.34                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  📋 Tab: Request Model                                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ➕ Request New AI Model/Provider                   │    │
│  │                                                      │    │
│  │ Provider: [Mistral AI                          ]   │    │
│  │ Model:    [Mistral Large                       ]   │    │
│  │ Use Case: [Research and analysis               ]   │    │
│  │ Usage:    [10M tokens/month                    ]   │    │
│  │ Email:    [user@example.com                    ]   │    │
│  │                                                      │    │
│  │                         [Submit Request]            │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

### REGULAR USER VIEW (Simplified Usage & Tiers)

```
┌──────────────────────────────────────────────────────────────┐
│  🗄 Usage & Tiers                   [🔒 User Access]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 🧠 Your Current Tier                                │    │
│  │                                                      │    │
│  │ Access level and features based on your sponsorship│    │
│  │                                                      │    │
│  │ ┌──────────────────────────────────────────────┐  │    │
│  │ │  Free Tier                          $0/mo    │  │    │
│  │ │  localStorage only • No database features    │  │    │
│  │ │                                              │  │    │
│  │ │  ✅ Full chat interface with all AI models  │  │    │
│  │ └──────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ⚡ Upgrade Your Tier                                │    │
│  │                                                      │    │
│  │ Get more storage, features, and capabilities        │    │
│  │                                                      │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │    │
│  │  │Supporter│  │   Pro   │  │  Power  │             │    │
│  │  │  $5/mo  │  │ $10/mo  │  │ $25/mo  │             │    │
│  │  │         │  │         │  │         │             │    │
│  │  │ 1 GB    │  │ 5 GB    │  │ 20 GB   │             │    │
│  │  │storage  │  │+ RAG    │  │Priority │             │    │
│  │  │         │  │         │  │         │             │    │
│  │  │[Sponsor]│  │[Sponsor]│  │[Sponsor]│             │    │
│  │  └─────────┘  └─────────┘  └─────────┘             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 💵 Transparent Pricing                              │    │
│  │                                                      │    │
│  │ See exactly what you're paying for                  │    │
│  │                                                      │    │
│  │ What Your Sponsorship Covers:                       │    │
│  │ • Database hosting (~$0.50/user/month)              │    │
│  │ • OpenAI API costs for RAG (~$2-5/user/month)       │    │
│  │ • Infrastructure and CDN                            │    │
│  │ • Development and support                           │    │
│  │ • New AI provider integrations                      │    │
│  │                                                      │    │
│  │ ℹ️ AI Provider Costs                                │    │
│  │ When using premium AI providers (OpenAI, Anthropic),│    │
│  │ you'll need your own API keys. We add a small       │    │
│  │ 3-5% markup to cover infrastructure costs.          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ ➕ Request New AI Provider                          │    │
│  │                                                      │    │
│  │ Want access to a specific AI model? Let us know!    │    │
│  │                                                      │    │
│  │ We're always looking to add new AI providers based  │    │
│  │ on user demand. Submit a request and we'll evaluate │    │
│  │ the cost, technical feasibility, and required tier. │    │
│  │                                                      │    │
│  │            [Submit Provider Request]                 │    │
│  │        (Opens email client)                          │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Differences Summary

| Feature | Maintainer | Regular User |
|---------|-----------|--------------|
| **API Key Management** | ✅ Full access | ❌ Not available |
| **Provider Directory** | ✅ View all providers | ℹ️ Info only |
| **Pricing Calculator** | ✅ Interactive calculator | ℹ️ Info only |
| **Request System** | ✅ Form submission | 📧 Email link |
| **Current Tier Display** | ❌ Not shown | ✅ Prominent display |
| **Upgrade Options** | ❌ Not shown | ✅ Upgrade cards |
| **Badge Indicator** | 👑 Maintainer Access | 🔒 User Access |
| **Tab Count** | 4 tabs | Single panel |
| **Configuration Access** | ✅ Add/remove keys | ❌ View only |

---

## Security Rationale

### Why Restrict Regular Users?

1. **Cost Control** - Prevent unauthorized use of expensive AI providers
2. **Support Burden** - Reduce confusion from users trying to configure complex APIs
3. **Security** - Limit exposure of sensitive configuration options
4. **Simplicity** - Provide users with only what they need to make decisions

### Why Give Maintainers Full Access?

1. **Testing** - Need to test provider integrations
2. **Development** - Configure and debug API connections
3. **Support** - Help users troubleshoot issues
4. **Maintenance** - Manage provider relationships and pricing

---

## User Journey Examples

### Regular User Journey
1. Opens Settings → Developer tab
2. Sees they're on "Free" tier
3. Reviews features of paid tiers
4. Clicks "Sponsor Now" to upgrade to Pro tier
5. Becomes sponsor on GitHub
6. Waits for manual verification (~24h)
7. Features unlock automatically

### Maintainer Journey
1. Opens Settings → Developer tab
2. Sees full Developer Settings with 4 tabs
3. Goes to API Keys tab
4. Adds API key for new provider (e.g., Mistral AI)
5. Tests integration in chat
6. Reviews pricing in Pricing tab
7. Processes user requests from Request Model tab

---

## Future Enhancements

Potential improvements to consider:

1. **Visual Indicators** - More prominent badges/icons for role identification
2. **Tooltips** - Explain why certain features are unavailable for users
3. **Progressive Disclosure** - Show partial info to users (e.g., provider list but not config)
4. **Self-Service** - Allow users to add their own keys with encryption
5. **Database Roles** - Move whitelist from code to Supabase for easier management

---

## Testing Checklist

### As Regular User
- [ ] Can see Usage & Tiers panel
- [ ] Cannot see API Keys tab
- [ ] Can view current tier
- [ ] Can see upgrade options
- [ ] Can access transparent pricing info
- [ ] Can submit provider request via email
- [ ] See "User Access" badge

### As Maintainer
- [ ] Can see full Developer Settings
- [ ] Can access all 4 tabs
- [ ] Can add/remove API keys
- [ ] Can view provider directory
- [ ] Can use pricing calculator
- [ ] Can review model requests
- [ ] See "Maintainer Access" badge

---

## Troubleshooting

### User Sees Maintainer View (Unexpected)
- Check if username is in `MAINTAINER_USERNAMES` array
- Remove from array if shouldn't have access
- Clear browser cache and reload

### Maintainer Sees User View (Unexpected)
- Verify GitHub username matches exactly (case-insensitive)
- Check if signed in with correct GitHub account
- Verify username is in `MAINTAINER_USERNAMES` array
- Check browser console for errors

---

## Documentation References

- [ROLE_BASED_ACCESS.md](./ROLE_BASED_ACCESS.md) - Complete role system guide
- [DEVELOPER_SETTINGS.md](./DEVELOPER_SETTINGS.md) - Developer settings usage guide
- [SPONSORSHIP_SYSTEM.md](./SPONSORSHIP_SYSTEM.md) - Sponsorship tier details

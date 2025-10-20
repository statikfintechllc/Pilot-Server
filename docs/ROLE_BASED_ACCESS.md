# Role-Based Access Control System

## Overview

Pilot Server implements a role-based access control system that provides different levels of access to the Developer Settings panel. **Important Update:** All users (both maintainers and regular users) can now add and manage their own API keys. The main difference between roles is the visibility of advanced administrative features.

## User Roles

### 1. Maintainer (Repository Owner/Core Developers)

**Identification:**
- GitHub username is in the `MAINTAINER_USERNAMES` whitelist
- Currently includes: `statikfintechllc`

**Access Level:**
- Full Developer Settings panel with all tabs
- API Key Management (same as regular users)
- Provider Directory (view all available and upcoming providers)
- Transparent Pricing Calculator (real-time cost calculations)
- Model Request Management (review user requests)

**UI Indicator:**
- Crown badge with "Maintainer Access" label

**Purpose:**
- Same API key capabilities as regular users
- Additional visibility into provider pricing and markup
- Review and process user requests for new AI models
- Monitor pricing and cost structures for planning

### 2. Regular User (All Other Users) - **NOW WITH API KEY MANAGEMENT**

**Identification:**
- Any authenticated GitHub user not in the maintainer whitelist

**Access Level:**
- **API Key Management** - Add/remove your own API keys for all providers ✨ NEW!
- **Current Tier Display** - View your sponsorship tier and features
- **Tier Upgrade Options** - Upgrade via GitHub Sponsors
- **Pricing Transparency** - Understand what you're paying for
- **Provider Requests** - Request new AI providers via email

**UI Indicator:**
- User badge with "User Access" label

**Features Available:**
- **API Key Management** - Full control over your own API keys ✅
  - Add keys for OpenAI, Anthropic, xAI, Google AI
  - Keys stored locally in your browser only
  - No API markup when using your own keys
  - Only pay for storage with your sponsorship tier
- **Current Tier Display** - Shows active tier (Free, Supporter, Pro, Power)
- **Feature List** - See what's included in current tier
- **Upgrade Options** - View and upgrade to higher tiers via GitHub Sponsors
- **Pricing Transparency** - Understand infrastructure and storage costs
- **Provider Requests** - Email-based system to request new AI models

### Key Difference Between Roles

**What's the Same:**
- ✅ Both can add/manage API keys
- ✅ Both can use all AI providers
- ✅ Both store keys locally in browser
- ✅ Both get direct provider billing with no markup (when using own keys)

**What's Different:**
- 🔧 Maintainers see advanced pricing calculator
- 🔧 Maintainers see provider directory details
- 🔧 Maintainers can review model request forms
- 👤 Regular users see streamlined interface focused on tier management

## Adding Maintainers

To add a new maintainer, edit `/src/components/DeveloperSettings.tsx`:

```typescript
const MAINTAINER_USERNAMES = [
  'statikfintechllc',
  'new-maintainer-username', // Add new maintainers here
];
```

**Important:** Maintainer usernames are checked case-insensitively.

## Security Considerations

### User View (ALL USERS CAN NOW ADD API KEYS)
- **Local Storage Only** - API keys stored in browser localStorage, never on servers
- **Direct Provider Auth** - All API calls go directly to providers (no proxy)
- **User-Controlled** - You manage your own keys and costs
- **No Markup with Own Keys** - Pay providers directly at base rates
- **Tier-Gated Features** - Database and RAG features require appropriate sponsorship
- **Transparent Pricing** - All costs fully disclosed to build trust

### Maintainer View
- **Same API Key Security** - Maintainers use same secure local storage as regular users
- **No Special Access** - Cannot see other users' API keys
- **Administrative Tools** - Additional pricing calculator and provider management tools
- **Whitelist-Based** - Maintainer access only for explicitly listed users

## Cost Model

### With Your Own API Keys (ALL USERS)
- **$0 API markup** - Pay AI providers directly at their base rates
- **Storage-only billing** - Sponsorship tier covers database costs only
- **Maximum savings** - 3-5% saved on every API call
- **Full control** - Set usage limits with providers directly

**Example Costs:**
- Free Tier: $0/month + direct provider costs
- Supporter Tier: $5/month (1GB storage) + direct provider costs
- Pro Tier: $10/month (5GB + RAG) + direct provider costs
- Power Tier: $25/month (20GB + all features) + direct provider costs

### Without Your Own API Keys
- **3-5% markup** - Small markup added to cover API management
- **Simplified billing** - One sponsorship payment covers everything
- **No provider accounts** - No need to sign up with multiple providers

## User Experience Flows

### Regular User Flow (UPDATED)
1. User clicks Settings → Developer tab
2. Sees "Developer Settings" interface with API key management
3. Can add/remove API keys for any provider
4. Views current tier and available features
5. Sees benefits of using own keys (no markup!)
6. Can upgrade via GitHub Sponsors link
7. Can request new AI providers via email

**Benefits Highlighted:**
- "Using your own API keys - You only pay for storage!"
- Green badge showing number of configured keys
- Cost savings calculator showing 3-5% savings

### Maintainer Flow
1. Maintainer clicks Settings → Developer tab
2. Sees full Developer Settings with 4 tabs
3. Can configure API keys for all providers
4. Can view provider directory and pricing
5. Can use pricing calculator
6. Can review model requests from users

## Implementation Details

### Role Detection
```typescript
function isMaintainer(username: string | undefined): boolean {
  if (!username) return false;
  return MAINTAINER_USERNAMES.includes(username.toLowerCase());
}
```

### Component Props
```typescript
interface DeveloperSettingsProps {
  userLogin?: string;    // GitHub username
  userTier?: string;     // Current sponsorship tier
}
```

### Conditional Rendering
```typescript
// In DeveloperSettings component
if (!isUserMaintainer) {
  return <SimplifiedUserView />;
}
return <FullDeveloperSettings />;
```

## Why This Design?

### Benefits

1. **Security** - Prevents regular users from accessing sensitive configuration
2. **Simplicity** - Users see only what's relevant to them
3. **Transparency** - Clear pricing and upgrade paths for users
4. **Flexibility** - Maintainers have full control for testing and development
5. **Scalability** - Easy to add more maintainers as team grows

### Trade-offs

- **Manual Whitelist** - Requires code update to add maintainers (could be database-driven)
- **No Self-Service** - Users can't configure their own API keys (by design for security)
- **Email-Based Requests** - No automated provider request system (intentional for cost control)

## Future Enhancements

Possible improvements:

1. **Database-Driven Roles** - Store maintainer list in Supabase
2. **API Key Self-Service** - Allow users to add their own keys with encryption
3. **Automated Requests** - In-app form submission and tracking for provider requests
4. **Usage Analytics** - Show maintainers aggregated usage data
5. **Tier Migration** - Automatic tier detection from Supabase sponsorship table

## Troubleshooting

### User Can't See Developer Settings
- Check if user is authenticated with GitHub
- Verify Developer tab is visible in Settings dialog
- User should see "Usage & Tiers" panel (not full developer settings)

### Maintainer Not Getting Full Access
- Verify username is in `MAINTAINER_USERNAMES` array
- Check username spelling and case
- Ensure user is signed in with correct GitHub account
- Check browser console for any JavaScript errors

### Changes Not Taking Effect
- Clear browser cache and localStorage
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Verify build completed successfully
- Check that updated code is deployed

## Support

For questions or issues with the role-based access system:
- Open an issue on GitHub
- Contact maintainers directly
- Check documentation in `/docs` directory

# Role-Based Access Control System

## Overview

Pilot Server implements a role-based access control system that provides different levels of access to the Developer Settings panel based on user roles.

## User Roles

### 1. Maintainer (Repository Owner/Core Developers)

**Identification:**
- GitHub username is in the `MAINTAINER_USERNAMES` whitelist
- Currently includes: `statikfintechllc`

**Access Level:**
- Full Developer Settings panel with all tabs
- API Key Management (add/remove keys for all providers)
- Provider Directory (view all available and upcoming providers)
- Transparent Pricing Calculator (real-time cost calculations)
- Model Request Management (review user requests)

**UI Indicator:**
- Crown badge with "Maintainer Access" label

**Purpose:**
- Configure API keys for testing and development
- Manage provider integrations
- Review and process user requests for new AI models
- Monitor pricing and cost structures

### 2. Regular User (All Other Users)

**Identification:**
- Any authenticated GitHub user not in the maintainer whitelist

**Access Level:**
- Simplified "Usage & Tiers" panel
- View current sponsorship tier and features
- See tier upgrade options with pricing
- Access transparent pricing information
- Submit requests for new AI providers via email

**UI Indicator:**
- Lock badge with "User Access" label

**Features Available:**
- **Current Tier Display** - Shows active tier (Free, Supporter, Pro, Power)
- **Feature List** - See what's included in current tier
- **Upgrade Options** - View and upgrade to higher tiers via GitHub Sponsors
- **Pricing Transparency** - Understand what sponsorship covers
- **Provider Requests** - Email-based system to request new AI models

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

### User View
- **No Sensitive Operations** - Regular users cannot add API keys or configure providers
- **Email-Based Requests** - New provider requests go through maintainer review
- **Tier-Gated Features** - Database and RAG features require appropriate sponsorship
- **Transparent Pricing** - All costs fully disclosed to build trust

### Maintainer View
- **Local Storage Only** - API keys stored in browser localStorage, never on servers
- **Direct Provider Auth** - All API calls go directly to providers (no proxy)
- **Whitelist-Based** - Maintainer access only for explicitly listed users
- **Audit Trail** - All configuration changes happen client-side

## User Experience Flows

### Regular User Flow
1. User clicks Settings → Developer tab
2. Sees simplified "Usage & Tiers" interface
3. Views current tier and available features
4. Can upgrade via GitHub Sponsors link
5. Can request new AI providers via email

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

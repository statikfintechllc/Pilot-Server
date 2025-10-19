# Sponsorship System Documentation

## Overview

Pilot Server uses a GitHub Sponsors-based tier system to provide sustainable funding while offering features based on sponsorship level.

## Tier Structure

### Free Tier ($0/month)
- **Features:**
  - ✅ Full chat interface
  - ✅ All AI models access
  - ✅ localStorage persistence (browser only)
  - ❌ No cross-device sync
  - ❌ No database storage
  - ❌ No RAG features
- **Storage:** Browser localStorage only (~5-10 MB limit)
- **Perfect for:** Testing, personal use, offline access

### Supporter Tier ($5/month)
- **Features:**
  - ✅ All Free tier features
  - ✅ Database storage
  - ✅ Cross-device sync
  - ✅ Persistent chat history
  - ❌ No RAG features
- **Storage:** 1 GB database quota
- **Perfect for:** Regular users who want sync

### Pro Tier ($10/month)
- **Features:**
  - ✅ All Supporter tier features
  - ✅ RAG (Retrieval-Augmented Generation)
  - ✅ Context-aware AI responses
  - ✅ Document embeddings
- **Storage:** 5 GB database quota
- **Perfect for:** Power users, developers

### Power Tier ($25/month)
- **Features:**
  - ✅ All Pro tier features
  - ✅ Priority support
  - ✅ Early access to new features
- **Storage:** 20 GB database quota
- **Perfect for:** Heavy users, teams

## How It Works

### 1. Sponsorship Flow

```
User → GitHub Sponsors → Sponsor statikfintechllc → Wait for Verification → Access Unlocked
```

1. User becomes a GitHub Sponsor at their chosen tier
2. User provides their GitHub username in the app
3. Repository maintainer verifies sponsorship (manual process)
4. User's tier is activated with appropriate quotas
5. User gains access to tier features

### 2. Storage Quota Enforcement

The system automatically tracks storage usage across:
- Chat conversations metadata
- Individual chat messages
- Document embeddings (for RAG)

**Automatic Calculation:**
- Triggers on every insert/update/delete to chats, messages, or embeddings
- Updates user's storage usage in real-time
- Prevents operations when quota is exceeded

### 3. Feature Access Control

Access to features is enforced at multiple levels:

**Database Level (RLS Policies):**
- User can only access their own data
- Row Level Security prevents cross-user data access

**Application Level (Service Layer):**
```typescript
// Before creating chat
const canAccess = await sponsorshipService.canAccessDatabase(userId);
if (!canAccess) {
  throw new Error('Database access requires sponsorship');
}

// Before adding document
const canAccessRAG = await sponsorshipService.canAccessRAG(userId);
if (!canAccessRAG) {
  throw new Error('RAG requires Pro tier');
}
```

**UI Level:**
- Features are disabled/hidden based on tier
- Upgrade prompts shown for locked features

## Technical Implementation

### Database Schema

**Tables:**
1. `sponsorship_tiers` - Defines available tiers
2. `user_sponsorships` - Links users to tiers
3. `storage_usage` - Tracks user storage consumption

**Key Functions:**
- `calculate_user_storage(user_uuid)` - Calculates total storage used
- `check_storage_quota(user_uuid)` - Returns true if under quota

### TypeScript Service

**SponsorshipService Methods:**
```typescript
// Get user's tier information
async getUserSponsorship(userId: string): Promise<UserSponsorship>

// Check feature access
async canAccessDatabase(userId: string): Promise<boolean>
async canAccessRAG(userId: string): Promise<boolean>

// Get storage information
async getStorageUsage(userId: string): Promise<StorageUsage>
async hasQuota(userId: string): Promise<boolean>
```

### React Component

**SponsorshipStatus Component:**
- Displays current tier
- Shows storage usage with progress bar
- Lists available tiers
- Provides "Become a Sponsor" button
- Shows upgrade instructions

## For Users

### How to Sponsor

1. **Navigate to GitHub Sponsors:**
   - Click "Become a Sponsor" in the app
   - Or visit: https://github.com/sponsors/statikfintechllc

2. **Choose Your Tier:**
   - Select from Supporter ($5), Pro ($10), or Power ($25)
   - Complete GitHub Sponsors checkout

3. **Activate in App:**
   - Return to Pilot Server
   - Navigate to Settings/Sponsorship
   - Enter your GitHub username
   - Click "Verify Sponsorship"

4. **Wait for Verification:**
   - Manual verification typically within 24 hours
   - You'll receive email confirmation
   - Features will activate automatically

### Managing Your Sponsorship

**View Usage:**
- Go to Settings/Sponsorship
- See storage usage and quota
- Monitor feature access

**Upgrade/Downgrade:**
- Change tier on GitHub Sponsors
- Changes take effect within 24 hours

**Cancel:**
- Cancel on GitHub Sponsors
- Access continues until end of billing period
- Reverts to Free tier after expiration

## For Maintainers

### Verification Process

**Manual Verification Steps:**

1. **Check GitHub Sponsors:**
   ```
   Go to: https://github.com/sponsors/statikfintechllc/dashboard
   View: Active sponsors list
   ```

2. **Verify in Database:**
   ```sql
   -- Update sponsorship as verified
   UPDATE user_sponsorships
   SET is_verified = true,
       verified_at = NOW(),
       expires_at = NOW() + INTERVAL '1 month'
   WHERE github_sponsor_username = 'username'
     AND tier_id = (SELECT id FROM sponsorship_tiers WHERE name = 'Pro');
   
   -- Update user profile quota
   UPDATE user_profiles
   SET sponsorship_tier = 'Pro',
       storage_quota_gb = 5
   WHERE id = (SELECT user_id FROM user_sponsorships WHERE github_sponsor_username = 'username');
   ```

3. **Notify User:**
   - Send confirmation email/message
   - User can immediately access features

### Monitoring

**Check Storage Usage:**
```sql
SELECT 
    up.username,
    up.sponsorship_tier,
    up.storage_used_gb,
    up.storage_quota_gb,
    ROUND((up.storage_used_gb / NULLIF(up.storage_quota_gb, 0) * 100), 2) as usage_percent
FROM user_profiles up
WHERE up.storage_quota_gb > 0
ORDER BY usage_percent DESC;
```

**Find Users Over Quota:**
```sql
SELECT 
    up.username,
    up.storage_used_gb,
    up.storage_quota_gb
FROM user_profiles up
WHERE up.storage_used_gb > up.storage_quota_gb
    AND up.storage_quota_gb > 0;
```

### Automation (Future Enhancement)

**Potential Improvements:**
1. GitHub Sponsors webhook integration (when available)
2. Automated verification via GitHub API
3. Email notifications for quota warnings
4. Automatic tier expiration handling

## Security Considerations

### Data Protection

1. **Row Level Security:**
   - All tables have RLS policies
   - Users can only access their own data
   - Verified at database level

2. **No Credential Exposure:**
   - User tokens stored locally only
   - No shared credentials in the system
   - Each user authenticates with their own GitHub account

3. **Quota Enforcement:**
   - Prevents storage abuse
   - Enforced at multiple levels (DB, service, UI)
   - Real-time calculation and checking

### Payment Security

- **No Payment Processing:**
  - All payments through GitHub Sponsors (PCI compliant)
  - No credit card data touches our system
  - GitHub handles all billing/refunds

## Pricing Philosophy

**Why These Prices?**

- **$5 (Supporter):** Covers database costs (~$0.50/user) + sustainability
- **$10 (Pro):** Includes OpenAI API costs for RAG (~$2-5/user)
- **$25 (Power):** Premium tier with priority support

**Cost Breakdown (per user/month):**
- Supabase database: ~$0.50
- OpenAI embeddings: ~$2-5 (heavy usage)
- Infrastructure/CDN: ~$0.50
- Support/development: Remaining

## FAQ

**Q: What happens if I exceed my quota?**
A: New chats/messages are blocked. Upgrade tier or delete old data.

**Q: Can I switch tiers anytime?**
A: Yes, via GitHub Sponsors. Changes within 24 hours.

**Q: Is my data deleted if I cancel?**
A: No, but you lose access. Data kept for 30 days.

**Q: Can I use localStorage mode forever?**
A: Yes! The Free tier works indefinitely with localStorage.

**Q: How is storage calculated?**
A: Text content size + embedding vectors + metadata = total

**Q: Can I get a refund?**
A: Contact GitHub Support for Sponsors billing issues.

## Roadmap

**Planned Features:**
- [ ] Automated sponsorship verification
- [ ] Email notifications for quota warnings
- [ ] Usage analytics dashboard
- [ ] Team/organization tiers
- [ ] Custom quotas for enterprises

## Support

**For Sponsorship Issues:**
- Email: support@statikfintechllc.com
- GitHub: Open issue with [SPONSORSHIP] tag

**For Billing Issues:**
- Contact GitHub Sponsors support
- Link: https://support.github.com

---

**Built with ❤️ by statikfintechllc**

Support sustainable open source development through GitHub Sponsors!

import { supabase, isSupabaseConfigured } from './client';

export interface SponsorshipTier {
  id: string;
  name: string;
  monthly_cost: number;
  storage_quota_gb: number;
  features: Record<string, boolean>;
  is_active: boolean;
}

export interface UserSponsorship {
  id: string;
  user_id: string;
  tier_id: string | null;
  github_sponsor_username: string | null;
  is_verified: boolean;
  verified_at: string | null;
  expires_at: string | null;
  tier?: SponsorshipTier;
}

export interface StorageUsage {
  total_size_bytes: number;
  chats_size_bytes: number;
  messages_size_bytes: number;
  embeddings_size_bytes: number;
  total_size_gb: number;
  last_calculated_at: string;
}

/**
 * Sponsorship service for managing tiers, verification, and quotas
 */
export class SponsorshipService {
  /**
   * Get all available sponsorship tiers
   */
  async getTiers(): Promise<SponsorshipTier[]> {
    if (!isSupabaseConfigured()) {
      return this.getDefaultTiers();
    }

    try {
      const { data, error } = await supabase
        .from('sponsorship_tiers')
        .select('*')
        .eq('is_active', true)
        .order('monthly_cost', { ascending: true });

      if (error) throw error;
      return data || this.getDefaultTiers();
    } catch (error) {
      console.error('Error fetching sponsorship tiers:', error);
      return this.getDefaultTiers();
    }
  }

  /**
   * Get default tiers (for localStorage mode)
   */
  private getDefaultTiers(): SponsorshipTier[] {
    return [
      {
        id: 'free',
        name: 'Free',
        monthly_cost: 0,
        storage_quota_gb: 0,
        features: { database: false, rag: false, localStorage: true },
        is_active: true,
      },
      {
        id: 'supporter',
        name: 'Supporter',
        monthly_cost: 5,
        storage_quota_gb: 1,
        features: { database: true, rag: false, localStorage: true },
        is_active: true,
      },
      {
        id: 'pro',
        name: 'Pro',
        monthly_cost: 10,
        storage_quota_gb: 5,
        features: { database: true, rag: true, localStorage: true },
        is_active: true,
      },
      {
        id: 'power',
        name: 'Power',
        monthly_cost: 25,
        storage_quota_gb: 20,
        features: { database: true, rag: true, localStorage: true, priority_support: true },
        is_active: true,
      },
    ];
  }

  /**
   * Get user's current sponsorship
   */
  async getUserSponsorship(userId: string): Promise<UserSponsorship | null> {
    if (!isSupabaseConfigured()) {
      // Return free tier for localStorage mode
      return {
        id: 'local-free',
        user_id: userId,
        tier_id: 'free',
        github_sponsor_username: null,
        is_verified: true,
        verified_at: new Date().toISOString(),
        expires_at: null,
        tier: this.getDefaultTiers()[0],
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_sponsorships')
        .select('*, tier:sponsorship_tiers(*)')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching user sponsorship:', error);
      return null;
    }
  }

  /**
   * Create or update user sponsorship
   */
  async updateSponsorship(
    userId: string,
    tierId: string,
    githubSponsorUsername: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Cannot update sponsorship in localStorage mode');
      return false;
    }

    try {
      // Get the tier to set the quota
      const { data: tier, error: tierError } = await supabase
        .from('sponsorship_tiers')
        .select('storage_quota_gb')
        .eq('id', tierId)
        .single();

      if (tierError) throw tierError;

      // Upsert sponsorship
      const { error: sponsorshipError } = await supabase
        .from('user_sponsorships')
        .upsert({
          user_id: userId,
          tier_id: tierId,
          github_sponsor_username: githubSponsorUsername,
          is_verified: false, // Needs manual verification
        });

      if (sponsorshipError) throw sponsorshipError;

      // Update user profile with quota
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          sponsorship_tier: tier ? tier.storage_quota_gb : 0,
          storage_quota_gb: tier ? tier.storage_quota_gb : 0,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error('Error updating sponsorship:', error);
      return false;
    }
  }

  /**
   * Get user's storage usage
   */
  async getStorageUsage(userId: string): Promise<StorageUsage | null> {
    if (!isSupabaseConfigured()) {
      // Calculate localStorage usage
      return this.getLocalStorageUsage();
    }

    try {
      // Trigger calculation
      const { data: calcData, error: calcError } = await supabase.rpc(
        'calculate_user_storage',
        { user_uuid: userId }
      );

      if (calcError) console.error('Error calculating storage:', calcError);

      // Fetch usage
      const { data, error } = await supabase
        .from('storage_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          total_size_bytes: data.total_size_bytes,
          chats_size_bytes: data.chats_size_bytes,
          messages_size_bytes: data.messages_size_bytes,
          embeddings_size_bytes: data.embeddings_size_bytes,
          total_size_gb: data.total_size_bytes / 1073741824,
          last_calculated_at: data.last_calculated_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching storage usage:', error);
      return null;
    }
  }

  /**
   * Calculate localStorage usage
   */
  private getLocalStorageUsage(): StorageUsage {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            totalBytes += key.length + value.length;
          }
        }
      }

      return {
        total_size_bytes: totalBytes,
        chats_size_bytes: totalBytes,
        messages_size_bytes: 0,
        embeddings_size_bytes: 0,
        total_size_gb: totalBytes / 1073741824,
        last_calculated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error calculating localStorage usage:', error);
      return {
        total_size_bytes: 0,
        chats_size_bytes: 0,
        messages_size_bytes: 0,
        embeddings_size_bytes: 0,
        total_size_gb: 0,
        last_calculated_at: new Date().toISOString(),
      };
    }
  }

  /**
   * Check if user has available quota
   */
  async hasQuota(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      // localStorage mode always has quota
      return true;
    }

    try {
      const { data, error } = await supabase.rpc('check_storage_quota', {
        user_uuid: userId,
      });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error checking quota:', error);
      return false;
    }
  }

  /**
   * Get user's tier name
   */
  async getUserTierName(userId: string): Promise<string> {
    const sponsorship = await this.getUserSponsorship(userId);
    if (!sponsorship || !sponsorship.tier) {
      return 'Free';
    }
    return sponsorship.tier.name;
  }

  /**
   * Check if user can access database features
   */
  async canAccessDatabase(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false; // No database in localStorage mode
    }

    const sponsorship = await this.getUserSponsorship(userId);
    if (!sponsorship || !sponsorship.tier) {
      return false; // Free tier, no database access
    }

    // Check if tier includes database feature and is verified
    return (
      sponsorship.is_verified &&
      sponsorship.tier.features.database === true
    );
  }

  /**
   * Check if user can access RAG features
   */
  async canAccessRAG(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const sponsorship = await this.getUserSponsorship(userId);
    if (!sponsorship || !sponsorship.tier) {
      return false;
    }

    return (
      sponsorship.is_verified &&
      sponsorship.tier.features.rag === true
    );
  }
}

export const sponsorshipService = new SponsorshipService();

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useVSCodeAuth } from '@/hooks/use-vscode-auth';
import { sponsorshipService, SponsorshipTier, StorageUsage } from '@/lib/supabase/sponsorship-service';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Heart, Database, Sparkles, Zap, ExternalLink } from '@phosphor-icons/react';

export function SponsorshipStatus() {
  const { authState } = useVSCodeAuth();
  const [tierName, setTierName] = useState<string>('Free');
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [quota, setQuota] = useState<number>(0);

  useEffect(() => {
    const loadSponsorshipData = async () => {
      if (!authState.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load tier info
        const [tierNameResult, usageResult, tiersResult, sponsorship] = await Promise.all([
          sponsorshipService.getUserTierName(authState.user.id),
          sponsorshipService.getStorageUsage(authState.user.id),
          sponsorshipService.getTiers(),
          sponsorshipService.getUserSponsorship(authState.user.id),
        ]);

        setTierName(tierNameResult);
        setUsage(usageResult);
        setTiers(tiersResult);
        
        if (sponsorship?.tier) {
          setQuota(sponsorship.tier.storage_quota_gb);
        }
      } catch (error) {
        console.error('Error loading sponsorship data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSponsorshipData();
  }, [authState.user?.id]);

  if (!authState.isAuthenticated) {
    return null;
  }

  const usagePercent = quota > 0 && usage ? (usage.total_size_gb / quota) * 100 : 0;
  const isLocalStorageMode = !isSupabaseConfigured();

  const getTierIcon = (name: string) => {
    switch (name) {
      case 'Free':
        return <Heart className="w-5 h-5" />;
      case 'Supporter':
        return <Database className="w-5 h-5" />;
      case 'Pro':
        return <Sparkles className="w-5 h-5" />;
      case 'Power':
        return <Zap className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getTierColor = (name: string) => {
    switch (name) {
      case 'Free':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'Supporter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Pro':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'Power':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTierIcon(tierName)}
            <CardTitle>Sponsorship Status</CardTitle>
          </div>
          <Badge className={getTierColor(tierName)}>{tierName} Tier</Badge>
        </div>
        <CardDescription>
          {isLocalStorageMode
            ? 'Running in localStorage mode - sponsor to unlock database features'
            : 'Your current sponsorship tier and storage usage'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Usage */}
        {!isLocalStorageMode && usage && quota > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">
                {usage.total_size_gb.toFixed(4)} GB / {quota} GB
              </span>
            </div>
            <Progress value={Math.min(usagePercent, 100)} className="h-2" />
            {usagePercent > 80 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ Approaching storage limit. Consider upgrading your tier.
              </p>
            )}
          </div>
        )}

        {/* localStorage Usage */}
        {isLocalStorageMode && usage && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">localStorage Used</span>
              <span className="font-medium">
                {(usage.total_size_bytes / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Browser storage limit: ~5-10 MB
            </p>
          </div>
        )}

        {/* Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Your Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className={`flex items-center gap-2 text-sm ${isLocalStorageMode ? 'text-muted-foreground' : 'text-green-600 dark:text-green-400'}`}>
              <Database className="w-4 h-4" />
              <span>Database {isLocalStorageMode ? '(locked)' : '✓'}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${tierName === 'Pro' || tierName === 'Power' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
              <Sparkles className="w-4 h-4" />
              <span>RAG {tierName === 'Pro' || tierName === 'Power' ? '✓' : '(locked)'}</span>
            </div>
          </div>
        </div>

        {/* Available Tiers */}
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading tiers...</div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Tiers</h4>
            <div className="grid gap-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-3 rounded-lg border ${
                    tier.name === tierName
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tier.name}</span>
                        {tier.name === tierName && (
                          <Badge variant="outline" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${tier.monthly_cost}/month • {tier.storage_quota_gb > 0 ? `${tier.storage_quota_gb} GB` : 'localStorage only'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsor Button */}
        <div className="pt-4 border-t">
          <Button
            className="w-full"
            onClick={() => window.open('https://github.com/sponsors/statikfintechllc', '_blank')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Become a Sponsor
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Support development and unlock premium features
          </p>
        </div>

        {/* Instructions */}
        {tierName === 'Free' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>How to upgrade:</strong>
              <br />
              1. Click "Become a Sponsor" above
              <br />
              2. Choose your tier on GitHub Sponsors
              <br />
              3. Your access will be verified within 24 hours
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVSCodeAuth } from '@/hooks/use-vscode-auth';
import { GitBranch, Robot, Lightning, Shield, Star, Check, Database, Cloud } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface TierFeature {
  name: string;
  included: boolean;
}

interface Tier {
  name: string;
  category: string;
  price: string;
  storage: string;
  apiType: string;
  features: TierFeature[];
  popular?: boolean;
  description: string;
}

const tiers: Tier[] = [
  {
    name: 'Open Use',
    category: 'Base Tier',
    price: 'Free',
    storage: 'Local Storage Only',
    apiType: 'N/A',
    description: 'GitHub Auth and Chat usage with all storage local (chat history only)',
    features: [
      { name: 'GitHub Authentication', included: true },
      { name: 'Local Chat History', included: true },
      { name: 'All AI Models', included: true },
      { name: 'Cloud Storage', included: false },
      { name: 'Cross-Device Sync', included: false },
    ]
  },
  {
    name: 'Power User Level 1',
    category: 'Power Users',
    price: '$5/month',
    storage: '1GB Storage',
    apiType: 'Your Own API',
    description: '1GB storage with user own API key',
    features: [
      { name: 'All Open Use Features', included: true },
      { name: 'Cloud Storage (1GB)', included: true },
      { name: 'Cross-Device Sync', included: true },
      { name: 'Use Your Own API Keys', included: true },
      { name: 'Provider API Access', included: false },
    ]
  },
  {
    name: 'Power User Level 2',
    category: 'Power Users',
    price: '$10/month',
    storage: '5GB Storage',
    apiType: 'Your Own API',
    description: '5GB storage with user own API key',
    popular: true,
    features: [
      { name: 'All Level 1 Features', included: true },
      { name: 'Cloud Storage (5GB)', included: true },
      { name: 'Extended Chat History', included: true },
      { name: 'Use Your Own API Keys', included: true },
      { name: 'Provider API Access', included: false },
    ]
  },
  {
    name: 'Power User Level 3',
    category: 'Power Users',
    price: '$15/month',
    storage: '10GB Storage',
    apiType: 'Your Own API',
    description: '10GB storage with user own API key',
    features: [
      { name: 'All Level 2 Features', included: true },
      { name: 'Cloud Storage (10GB)', included: true },
      { name: 'Unlimited Chat History', included: true },
      { name: 'Use Your Own API Keys', included: true },
      { name: 'Provider API Access', included: false },
    ]
  },
  {
    name: 'All-Access Level 1',
    category: 'All-Access',
    price: '$20/month',
    storage: '1GB Storage',
    apiType: 'Provider API',
    description: '1GB storage with provider API per million tokens or end of month',
    features: [
      { name: 'All Power User Features', included: true },
      { name: 'Cloud Storage (1GB)', included: true },
      { name: 'Provider API Access', included: true },
      { name: 'Per Million Tokens Billing', included: true },
      { name: 'No API Key Required', included: true },
    ]
  },
  {
    name: 'All-Access Level 2',
    category: 'All-Access',
    price: '$35/month',
    storage: '5GB Storage',
    apiType: 'Provider API',
    description: '5GB storage with provider API per million tokens or end of month',
    features: [
      { name: 'All Level 1 Features', included: true },
      { name: 'Cloud Storage (5GB)', included: true },
      { name: 'Provider API Access', included: true },
      { name: 'Per Million Tokens Billing', included: true },
      { name: 'Priority Support', included: true },
    ]
  },
  {
    name: 'All-Access Level 3',
    category: 'All-Access',
    price: '$50/month',
    storage: '10GB Storage',
    apiType: 'Provider API',
    description: '10GB storage with provider API per million tokens or end of month',
    features: [
      { name: 'All Level 2 Features', included: true },
      { name: 'Cloud Storage (10GB)', included: true },
      { name: 'Provider API Access', included: true },
      { name: 'Per Million Tokens Billing', included: true },
      { name: 'Premium Support', included: true },
    ]
  }
];

export function SignUp() {
  const { authState, signIn } = useVSCodeAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signIn();
  };

  const handleBackToApp = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Robot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pilot Server
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
          
          {authState.isAuthenticated ? (
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                Signed in as {authState.user?.login || authState.user?.name || 'User'}
              </Badge>
              <Button onClick={handleBackToApp} variant="outline">
                Back to App
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn} size="lg" className="mt-4">
              <GitBranch className="w-5 h-5 mr-2" />
              Sign In with GitHub
            </Button>
          )}
        </div>

        {/* Tier Categories */}
        <div className="space-y-12">
          {/* Open Use Tier */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Open Use
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {tiers.filter(t => t.category === 'Base Tier').map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </div>
          </div>

          {/* Power Users */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lightning className="w-6 h-6 text-primary" />
              Power Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.filter(t => t.category === 'Power Users').map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </div>
          </div>

          {/* All-Access */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-primary" />
              All-Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.filter(t => t.category === 'All-Access').map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center space-y-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <h3 className="font-semibold mb-2">1. Choose Your Tier</h3>
                <p className="text-sm text-muted-foreground">
                  Select the plan that best fits your needs - from free local storage to full cloud access with provider APIs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Become a GitHub Sponsor</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our GitHub Sponsors page and support the project at your chosen tier level.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Get Verified</h3>
                <p className="text-sm text-muted-foreground">
                  After sponsoring, your access will be verified and activated (typically within 24 hours).
                </p>
              </div>
              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <a href="https://github.com/sponsors/statikfintechllc" target="_blank" rel="noopener noreferrer">
                    <Star className="w-4 h-4 mr-2" />
                    Become a Sponsor
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <Card className={`relative ${tier.popular ? 'border-primary border-2 shadow-lg' : ''}`}>
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{tier.name}</span>
          {tier.price !== 'Free' && (
            <span className="text-2xl font-bold">{tier.price}</span>
          )}
          {tier.price === 'Free' && (
            <Badge variant="secondary">Free</Badge>
          )}
        </CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="flex gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            <Database className="w-3 h-3 mr-1" />
            {tier.storage}
          </Badge>
          <Badge variant="outline" className="text-xs">
            API: {tier.apiType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground">—</span>
              )}
              <span className={feature.included ? '' : 'text-muted-foreground'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

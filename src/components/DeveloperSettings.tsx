import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Key, 
  Database, 
  Brain, 
  DollarSign, 
  PlusCircle,
  Eye,
  EyeSlash,
  CheckCircle,
  Warning,
  Info,
  Lightning,
  ChartBar
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface APIProvider {
  id: string;
  name: string;
  description: string;
  website: string;
  costPerMillionTokens: {
    input: number;
    output: number;
  };
  markup: number; // percentage (3-5%)
  available: boolean;
  requiresSponsorship?: 'supporter' | 'pro' | 'power';
}

const API_PROVIDERS: APIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5, and other OpenAI models',
    website: 'https://openai.com',
    costPerMillionTokens: { input: 10, output: 30 },
    markup: 3,
    available: true,
    requiresSponsorship: 'pro'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models',
    website: 'https://anthropic.com',
    costPerMillionTokens: { input: 15, output: 75 },
    markup: 4,
    available: true,
    requiresSponsorship: 'pro'
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    description: 'Grok models by Elon Musk\'s xAI',
    website: 'https://x.ai',
    costPerMillionTokens: { input: 5, output: 15 },
    markup: 3,
    available: true,
    requiresSponsorship: 'pro'
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini Pro, Gemini Ultra, and other Google models',
    website: 'https://ai.google.dev',
    costPerMillionTokens: { input: 7, output: 21 },
    markup: 3,
    available: true,
    requiresSponsorship: 'supporter'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Command R+, Embed, and other Cohere models',
    website: 'https://cohere.com',
    costPerMillionTokens: { input: 3, output: 15 },
    markup: 3,
    available: false,
    requiresSponsorship: 'pro'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral Large, Mistral Medium, and other open models',
    website: 'https://mistral.ai',
    costPerMillionTokens: { input: 4, output: 12 },
    markup: 3,
    available: false,
    requiresSponsorship: 'supporter'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Online models with real-time search capabilities',
    website: 'https://perplexity.ai',
    costPerMillionTokens: { input: 5, output: 5 },
    markup: 4,
    available: false,
    requiresSponsorship: 'pro'
  },
];

interface APIKey {
  provider: string;
  key: string;
  isValid?: boolean;
}

interface ModelRequest {
  provider: string;
  modelName: string;
  useCase: string;
  estimatedUsage: string;
  email: string;
}

export function DeveloperSettings() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [currentKey, setCurrentKey] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');
  const [modelRequest, setModelRequest] = useState<ModelRequest>({
    provider: '',
    modelName: '',
    useCase: '',
    estimatedUsage: '',
    email: ''
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('developer_api_keys');
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    }
  }, []);

  // Save API keys to localStorage
  const saveApiKeys = (keys: APIKey[]) => {
    setApiKeys(keys);
    localStorage.setItem('developer_api_keys', JSON.stringify(keys));
  };

  const addApiKey = () => {
    if (!currentKey || !currentProvider) return;
    
    const newKey: APIKey = {
      provider: currentProvider,
      key: currentKey,
      isValid: undefined // Will be validated on use
    };

    const existingIndex = apiKeys.findIndex(k => k.provider === currentProvider);
    if (existingIndex >= 0) {
      const updated = [...apiKeys];
      updated[existingIndex] = newKey;
      saveApiKeys(updated);
    } else {
      saveApiKeys([...apiKeys, newKey]);
    }

    setCurrentKey('');
    setCurrentProvider('');
  };

  const removeApiKey = (provider: string) => {
    saveApiKeys(apiKeys.filter(k => k.provider !== provider));
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const calculateUserCost = (provider: APIProvider) => {
    const inputCost = provider.costPerMillionTokens.input * (1 + provider.markup / 100);
    const outputCost = provider.costPerMillionTokens.output * (1 + provider.markup / 100);
    return { input: inputCost, output: outputCost };
  };

  const submitModelRequest = () => {
    // In a real implementation, this would send to your backend
    console.log('Model Request Submitted:', modelRequest);
    
    // Save to localStorage for now
    const requests = JSON.parse(localStorage.getItem('model_requests') || '[]');
    requests.push({ ...modelRequest, timestamp: new Date().toISOString() });
    localStorage.setItem('model_requests', JSON.stringify(requests));
    
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setModelRequest({
        provider: '',
        modelName: '',
        useCase: '',
        estimatedUsage: '',
        email: ''
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Developer Settings</h2>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="request">Request Model</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Configure your API keys for different AI providers. Keys are stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Key */}
              <div className="space-y-3">
                <Label>Add API Key</Label>
                <div className="flex gap-2">
                  <Select value={currentProvider} onValueChange={setCurrentProvider}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {API_PROVIDERS.filter(p => p.available).map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="password"
                    placeholder="Enter API key"
                    value={currentKey}
                    onChange={(e) => setCurrentKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addApiKey} disabled={!currentKey || !currentProvider}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Existing Keys */}
              {apiKeys.length > 0 && (
                <div className="space-y-2">
                  <Label>Your API Keys</Label>
                  {apiKeys.map(apiKey => {
                    const provider = API_PROVIDERS.find(p => p.id === apiKey.provider);
                    return (
                      <div key={apiKey.provider} className="flex items-center gap-2 p-3 rounded-lg border">
                        <Badge variant="outline">{provider?.name || apiKey.provider}</Badge>
                        <Input
                          type={showKeys[apiKey.provider] ? 'text' : 'password'}
                          value={apiKey.key}
                          readOnly
                          className="flex-1 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleShowKey(apiKey.provider)}
                        >
                          {showKeys[apiKey.provider] ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApiKey(apiKey.provider)}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Security Note</p>
                  <p className="text-xs mt-1">
                    API keys are stored locally in your browser and never sent to our servers. 
                    They're only used to authenticate directly with the AI provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Environment Configuration
              </CardTitle>
              <CardDescription>
                Additional configuration options (typically set via .env file)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Supabase URL</Label>
                <Input
                  type="text"
                  value={import.meta.env.VITE_SUPABASE_URL || ''}
                  readOnly
                  className="font-mono text-sm"
                  placeholder="Not configured"
                />
              </div>
              <div className="space-y-2">
                <Label>Supabase Anon Key</Label>
                <Input
                  type="password"
                  value={import.meta.env.VITE_SUPABASE_ANON_KEY || ''}
                  readOnly
                  className="font-mono text-sm"
                  placeholder="Not configured"
                />
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <Warning className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Build-Time Variables</p>
                  <p className="text-xs mt-1">
                    These values are set during build and cannot be changed at runtime. 
                    Update your .env file and rebuild the app to change them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Available AI Providers
              </CardTitle>
              <CardDescription>
                Supported AI providers and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {API_PROVIDERS.map(provider => {
                  const hasKey = apiKeys.some(k => k.provider === provider.id);
                  return (
                    <div key={provider.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{provider.name}</h4>
                            {provider.available ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                                Coming Soon
                              </Badge>
                            )}
                            {provider.requiresSponsorship && (
                              <Badge variant="secondary" className="text-xs">
                                {provider.requiresSponsorship}+
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{provider.description}</p>
                          <a 
                            href={provider.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            {provider.website}
                          </a>
                        </div>
                        {hasKey && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Key className="w-3 h-3 mr-1" />
                            Configured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Input: ${provider.costPerMillionTokens.input}/M tokens</span>
                        <span>•</span>
                        <span>Output: ${provider.costPerMillionTokens.output}/M tokens</span>
                        <span>•</span>
                        <span>Markup: {provider.markup}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Transparent Pricing
              </CardTitle>
              <CardDescription>
                Live token costs and developer markup for all providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pricing Explanation */}
                <div className="flex items-start gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <ChartBar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">How Pricing Works</p>
                    <p className="text-blue-700 mt-1 text-xs">
                      We add a small markup (3-5%) to cover infrastructure costs. 
                      Your final cost = Provider Cost × (1 + Markup%). 
                      All prices shown per million tokens.
                    </p>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="space-y-3">
                  {API_PROVIDERS.filter(p => p.available).map(provider => {
                    const userCost = calculateUserCost(provider);
                    return (
                      <div key={provider.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{provider.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {provider.markup}% markup
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Input Tokens */}
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Input Tokens</Label>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-green-600">
                                ${userCost.input.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">/M tokens</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Base: ${provider.costPerMillionTokens.input.toFixed(2)} + 
                              ${(userCost.input - provider.costPerMillionTokens.input).toFixed(2)} markup
                            </p>
                          </div>

                          {/* Output Tokens */}
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Output Tokens</Label>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-blue-600">
                                ${userCost.output.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">/M tokens</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Base: ${provider.costPerMillionTokens.output.toFixed(2)} + 
                              ${(userCost.output - provider.costPerMillionTokens.output).toFixed(2)} markup
                            </p>
                          </div>
                        </div>

                        {/* Example Cost */}
                        <div className="mt-3 p-2 rounded bg-muted/50 text-xs">
                          <Lightning className="w-3 h-3 inline mr-1" />
                          <span className="font-medium">Example:</span> 100K input + 10K output tokens = 
                          ${((userCost.input * 0.1) + (userCost.output * 0.01)).toFixed(4)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tier Price Adjustments */}
                <div className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Sponsorship Tier Adjustments
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supporter ($5/mo):</span>
                      <span className="font-medium">+$0 (baseline)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pro ($10/mo):</span>
                      <span className="font-medium">+$10-20 for high-cost models</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Power ($25/mo):</span>
                      <span className="font-medium">+$30-40 for premium models</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * Prices adjust based on provider costs. Heavy users on expensive models 
                    may see higher tier fees to maintain sustainability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Request Model Tab */}
        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Request New Model/Provider
              </CardTitle>
              <CardDescription>
                Request support for a new AI model or provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requestSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <h3 className="text-lg font-medium">Request Submitted!</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    We'll review your request and assess if the model is worth adding based on 
                    cost, demand, and technical feasibility. You'll be notified when it's available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Info Box */}
                  <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">How This Works</p>
                      <p className="text-xs mt-1">
                        We evaluate each request based on:
                        • Provider API costs and markup needed
                        • Expected usage and demand
                        • Technical complexity of integration
                        • Sponsorship tier required to support costs
                      </p>
                    </div>
                  </div>

                  {/* Request Form */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Provider/Company *</Label>
                      <Input
                        placeholder="e.g., Anthropic, Cohere, Mistral AI"
                        value={modelRequest.provider}
                        onChange={(e) => setModelRequest({...modelRequest, provider: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Model Name *</Label>
                      <Input
                        placeholder="e.g., Claude 3.5 Sonnet, Command R+"
                        value={modelRequest.modelName}
                        onChange={(e) => setModelRequest({...modelRequest, modelName: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Your Use Case *</Label>
                      <Textarea
                        placeholder="Describe how you'd use this model and why it's important"
                        value={modelRequest.useCase}
                        onChange={(e) => setModelRequest({...modelRequest, useCase: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Monthly Usage *</Label>
                      <Select 
                        value={modelRequest.estimatedUsage}
                        onValueChange={(value) => setModelRequest({...modelRequest, estimatedUsage: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light (1-10M tokens/mo)</SelectItem>
                          <SelectItem value="moderate">Moderate (10-50M tokens/mo)</SelectItem>
                          <SelectItem value="heavy">Heavy (50-200M tokens/mo)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (200M+ tokens/mo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Email for Updates *</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={modelRequest.email}
                        onChange={(e) => setModelRequest({...modelRequest, email: e.target.value})}
                      />
                    </div>

                    <Button 
                      onClick={submitModelRequest}
                      disabled={!modelRequest.provider || !modelRequest.modelName || !modelRequest.useCase || !modelRequest.estimatedUsage || !modelRequest.email}
                      className="w-full"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                  </div>

                  {/* Cost Disclaimer */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <Warning className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium">Cost Consideration</p>
                      <p className="text-xs mt-1">
                        High-cost models may require higher sponsorship tiers. 
                        We'll inform you of tier requirements and pricing before implementation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

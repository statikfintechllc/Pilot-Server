import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Cpu } from '@phosphor-icons/react';
import { AIModel } from '@/lib/types';
import { memo, useEffect } from 'react';

interface ModelBubbleProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  isLoading: boolean;
}

export const ModelBubble = memo(function ModelBubble({ selectedModel, onModelChange, isLoading }: ModelBubbleProps) {
  const modelDisplayNames = {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini'
  };

  // Suppress ResizeObserver errors globally
  useEffect(() => {
    const originalError = window.console.error;
    window.console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('ResizeObserver loop completed with undelivered notifications')) {
        return; // Suppress this specific error
      }
      originalError.apply(console, args);
    };

    return () => {
      window.console.error = originalError;
    };
  }, []);

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 floating-element">
      <Select 
        value={selectedModel} 
        onValueChange={(value) => onModelChange(value as AIModel)}
        disabled={isLoading}
      >
        <SelectTrigger 
          className={`
            bg-card/95 backdrop-blur-xl border border-border/30 rounded-full
            shadow-lg hover:shadow-xl transition-all duration-300 ease-out
            px-4 py-1 min-w-[140px] h-auto will-change-transform
            ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}
            hover:bg-card active:scale-[0.98] group focus:ring-2 focus:ring-primary/50 focus:ring-offset-0
          `}
          style={{ 
            transform: 'translateZ(0)', // Force hardware acceleration
            backfaceVisibility: 'hidden' // Reduce repaints
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Cpu className={`w-4 h-4 text-primary transition-all duration-300 ${
                isLoading ? 'animate-pulse' : 'group-hover:text-primary/80'
              }`} />
              {isLoading && (
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              )}
            </div>
            
            <span className="text-sm font-medium text-foreground/90 whitespace-nowrap">
              {modelDisplayNames[selectedModel]}
            </span>
            
            <ChevronDown 
              className="w-3.5 h-3.5 text-muted-foreground transition-all duration-300 group-hover:text-foreground/70 group-data-[state=open]:rotate-180" 
            />
          </div>
        </SelectTrigger>
        
        <SelectContent className="min-w-[140px] rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
          <SelectItem value="gpt-4o" className="text-sm rounded-lg focus:bg-accent/50">
            GPT-4o
          </SelectItem>
          <SelectItem value="gpt-4o-mini" className="text-sm rounded-lg focus:bg-accent/50">
            GPT-4o Mini
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
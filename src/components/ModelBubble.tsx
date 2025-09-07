import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Cpu } from '@phosphor-icons/react';
import { AIModel } from '@/lib/types';

interface ModelBubbleProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  isLoading: boolean;
}

export function ModelBubble({ selectedModel, onModelChange, isLoading }: ModelBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const modelDisplayNames = {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini'
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className={`
          bg-card/95 backdrop-blur-xl border border-border/30 rounded-full
          shadow-lg hover:shadow-xl transition-all duration-300 ease-out
          ${isExpanded ? 'px-4 py-2.5 min-w-[140px]' : 'px-4 py-2'}
          ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          hover:bg-card active:scale-95 group
        `}
        onClick={() => !isLoading && setIsExpanded(!isExpanded)}
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
          
          {isExpanded ? (
            <Select 
              value={selectedModel} 
              onValueChange={(value) => {
                onModelChange(value as AIModel);
                setIsExpanded(false);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0 focus:ring-offset-0 hover:bg-transparent">
                <SelectValue />
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
          ) : (
            <span className="text-sm font-medium text-foreground/90 whitespace-nowrap">
              {modelDisplayNames[selectedModel]}
            </span>
          )}
          
          <ChevronDown 
            className={`w-3.5 h-3.5 text-muted-foreground transition-all duration-300 ${
              isExpanded ? 'rotate-180' : 'group-hover:text-foreground/70'
            }`} 
          />
        </div>
      </div>
    </div>
  );
}
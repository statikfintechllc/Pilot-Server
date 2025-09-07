import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Robot } from '@phosphor-icons/react';
import { AIModel } from '@/lib/types';

interface ChatHeaderProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

export function ChatHeader({ selectedModel, onModelChange, onNewChat, isLoading }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-2 md:p-4 border-b bg-card/50 backdrop-blur-sm min-h-[56px] md:min-h-[64px]">
      <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1 max-w-[40%] md:max-w-none">
        <Robot className="w-4 h-4 md:w-6 md:h-6 text-primary flex-shrink-0" />
        <h1 className="text-sm md:text-xl font-semibold truncate">Pilot Server</h1>
      </div>
      
      <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-16 md:w-40 text-xs md:text-sm h-7 md:h-10 px-1.5 md:px-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={onNewChat} 
          size="sm"
          disabled={isLoading}
          className="gap-1 md:gap-2 px-1.5 md:px-3 h-7 md:h-10 text-xs md:text-sm"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>
    </div>
  );
}
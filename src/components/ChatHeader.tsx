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
    <div className="flex items-center justify-between p-3 md:p-4 border-b bg-card/50 backdrop-blur-sm min-h-[60px]">
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
        <div className="flex items-center gap-2 min-w-0">
          <Robot className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
          <h1 className="text-base md:text-xl font-semibold truncate">Pilot Server</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-20 md:w-40 text-xs md:text-sm h-8 md:h-10">
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
          className="gap-1 md:gap-2 px-2 md:px-3 h-8 md:h-10 text-xs md:text-sm"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden xs:inline">New</span>
          <span className="hidden sm:inline">Chat</span>
        </Button>
      </div>
    </div>
  );
}
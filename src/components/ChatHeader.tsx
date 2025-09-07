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
    <div className="p-2 md:p-4 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2">
        {/* Title row centered */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2 w-full relative">
          <Robot className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
          <h1 className="text-sm md:text-lg font-semibold">Pilot Server</h1>
          
          {/* New Chat button positioned absolutely to the right */}
          <Button 
            onClick={onNewChat} 
            size="sm"
            disabled={isLoading}
            className="absolute right-0 px-1.5 md:px-3 h-7 md:h-9 text-xs md:text-sm w-7 md:w-auto"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline ml-1">New Chat</span>
          </Button>
        </div>
        
        {/* Model selector row centered */}
        <div className="flex justify-center w-full">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-40 md:w-52 text-xs md:text-sm h-7 md:h-9 px-2 md:px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o" className="text-xs md:text-sm">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini" className="text-xs md:text-sm">GPT-4o Mini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
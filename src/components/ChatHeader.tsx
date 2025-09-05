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
    <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Robot className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">Pilot Server</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-40">
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
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
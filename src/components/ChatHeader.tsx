import { Button } from '@/components/ui/button';
import { Plus, Robot } from '@phosphor-icons/react';

interface ChatHeaderProps {
  onNewChat: () => void;
  isLoading: boolean;
}

export function ChatHeader({ onNewChat, isLoading }: ChatHeaderProps) {
  return (
    <div className="p-3 md:p-4 border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-full">
        {/* Title on the left */}
        <div className="flex items-center gap-2">
          <Robot className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
          <h1 className="text-lg md:text-xl font-semibold">Pilot Server</h1>
        </div>
        
        {/* New Chat button on the right */}
        <Button 
          onClick={onNewChat} 
          size="sm"
          disabled={isLoading}
          className="px-3 h-9 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Chat } from '@/lib/types';
import { ChatText, Trash, List } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onDeleteChat, 
  onNewChat 
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortedChats = [...chats].sort((a, b) => b.lastUpdated - a.lastUpdated);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    setIsOpen(false);
  };

  const ChatList = () => (
    <>
      {sortedChats.length === 0 ? (
        <div className="text-center py-12 px-4 text-muted-foreground">
          <ChatText className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-medium mb-1">No conversations yet</p>
          <p className="text-xs opacity-70">Start a new chat to begin</p>
        </div>
      ) : (
        sortedChats.map((chat) => (
          <div key={chat.id} className="group relative mb-1.5">
            <Button
              variant={currentChatId === chat.id ? "secondary" : "ghost"}
              onClick={() => handleSelectChat(chat.id)}
              className={cn(
                "w-full justify-start text-left h-auto p-3 group-hover:pr-10 transition-all",
                "min-h-[52px]",
                currentChatId === chat.id && "bg-secondary/80 border border-secondary"
              )}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-medium text-sm leading-tight truncate pr-2">
                  {chat.title}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {formatDate(chat.lastUpdated)} • {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              title="Delete chat"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))
      )}
    </>
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("flex flex-col", isMobile ? "h-full max-h-[100dvh]" : "h-full")}>
      {/* New Chat Button */}
      <div className={cn("flex-shrink-0 border-b bg-background/95", isMobile ? "p-4" : "p-3")}>
        <Button 
          onClick={() => {
            onNewChat();
            setIsOpen(false);
          }} 
          className={cn("w-full justify-start gap-3 text-sm font-medium", isMobile ? "h-11" : "h-10")}
        >
          <ChatText className="w-5 h-5" />
          New Chat
        </Button>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isMobile ? (
          <div className="h-full overflow-auto p-3">
            <ChatList />
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2">
              <ChatList />
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="fixed top-3 left-3 z-50 shadow-lg h-9 w-9 p-0 bg-background/95 backdrop-blur-sm border-border/50"
              aria-label="Open chat history"
            >
              <List className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[85vw] max-w-[350px] p-0 border-r-2 border-border/20 flex flex-col h-full overflow-hidden"
          >
            <SheetHeader className="flex-shrink-0 p-4 pb-3 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <SheetTitle className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">Chat History</SheetTitle>
                <div className="w-9"></div> {/* Spacer to balance the layout */}
              </div>
            </SheetHeader>
            <div className="flex-1 min-h-0 overflow-hidden">
              <SidebarContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex w-80 border-r bg-card/50 backdrop-blur-sm flex-col">
        <SidebarContent isMobile={false} />
      </div>
    </>
  );
}
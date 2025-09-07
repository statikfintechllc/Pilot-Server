import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { Message } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-xl md:text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Start a conversation</h3>
            <p className="text-muted-foreground text-sm mt-1 px-4">
              Ask me anything! I can help with code, analysis, explanations, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center px-4">
            <span className="px-3 py-1 bg-muted rounded-full text-xs">Write code</span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs">Debug issues</span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs">Explain concepts</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="space-y-1 p-2 md:p-4 pt-14">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex gap-3 p-2 md:p-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="bg-card border shadow-sm rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
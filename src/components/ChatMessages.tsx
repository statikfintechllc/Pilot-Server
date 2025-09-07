import { useEffect, useRef, useCallback } from 'react';
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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        } catch (error) {
          // Silently handle scroll errors including ResizeObserver
          if (!(error instanceof Error && error.message.includes('ResizeObserver'))) {
            console.debug('Scroll error (non-critical):', error);
          }
        }
      });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isLoading, scrollToBottom]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-2 md:p-4 pt-12 md:pt-16">
        <div className="text-center space-y-2 md:space-y-3 max-w-md">
          <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-lg md:text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-base md:text-xl font-semibold">Start a conversation</h3>
            <p className="text-muted-foreground text-xs md:text-sm mt-1 px-2 md:px-4">
              Ask me anything! I can help with code, analysis, explanations, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2 justify-center px-2 md:px-4">
            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-muted rounded-full text-[10px] md:text-xs">Write code</span>
            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-muted rounded-full text-[10px] md:text-xs">Debug issues</span>
            <span className="px-2 md:px-3 py-0.5 md:py-1 bg-muted rounded-full text-[10px] md:text-xs">Explain concepts</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 scroll-container" ref={scrollAreaRef}>
      <div className="space-y-0.5 md:space-y-1 p-1 md:p-4 pt-12 md:pt-14">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex gap-1 md:gap-3 p-1 md:p-4">
            <div className="flex-shrink-0 w-5 h-5 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary animate-spin" />
            </div>
            <div className="bg-card border shadow-sm rounded-lg md:rounded-2xl px-2 md:px-4 py-1.5 md:py-3">
              <div className="flex items-center gap-1 md:gap-2 text-muted-foreground">
                <span className="text-xs md:text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
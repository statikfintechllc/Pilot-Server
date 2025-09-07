import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, User, Robot } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let processedContent = content;
    const codeBlocks: { match: string; language: string; code: string; id: string }[] = [];
    
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const id = `code-${Date.now()}-${Math.random()}`;
      const language = match[1] || 'text';
      const code = match[2].trim();
      codeBlocks.push({ match: match[0], language, code, id });
    }
    
    const parts = processedContent.split(codeBlockRegex);
    const result: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i += 3) {
      if (parts[i]) {
        const textPart = parts[i].replace(inlineCodeRegex, '`$1`');
        const inlineCodeParts = textPart.split(inlineCodeRegex);
        
        for (let j = 0; j < inlineCodeParts.length; j += 2) {
          if (inlineCodeParts[j]) {
            result.push(
              <span key={`text-${i}-${j}`} className="whitespace-pre-wrap">
                {inlineCodeParts[j]}
              </span>
            );
          }
          if (inlineCodeParts[j + 1]) {
            result.push(
              <code key={`inline-${i}-${j}`} className="px-1 py-0.5 bg-muted rounded text-[10px] md:text-sm font-mono">
                {inlineCodeParts[j + 1]}
              </code>
            );
          }
        }
      }
      
      if (parts[i + 1] && parts[i + 2]) {
        const language = parts[i + 1];
        const code = parts[i + 2];
        result.push(
          <div key={`code-${i}`} className="my-1.5 md:my-3 rounded-md md:rounded-lg border bg-muted/30 overflow-hidden">
            <div className="flex items-center justify-between px-2 md:px-3 py-1 md:py-2 bg-muted/50 border-b">
              <span className="text-[9px] md:text-xs font-medium text-muted-foreground uppercase">
                {language || 'code'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(code)}
                className="h-4 md:h-6 px-1 md:px-2 text-[9px] md:text-xs"
              >
                <Copy className="w-2 h-2 md:w-3 md:h-3" />
              </Button>
            </div>
            <pre className="p-2 md:p-3 overflow-x-auto">
              <code className="text-[10px] md:text-sm font-mono leading-tight md:leading-relaxed">{code}</code>
            </pre>
          </div>
        );
      }
    }
    
    return result.length > 0 ? result : <span className="whitespace-pre-wrap">{content}</span>;
  };

  return (
    <div className={cn(
      "flex gap-1 md:gap-3 p-1 md:p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-5 h-5 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Robot className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] md:max-w-[80%] rounded-lg md:rounded-2xl px-2 md:px-4 py-1.5 md:py-3 relative group",
        isUser 
          ? "bg-primary text-primary-foreground ml-6 md:ml-12" 
          : "bg-card border shadow-sm"
      )}>
        {message.imageUrl && (
          <div className="mb-1 md:mb-3">
            <img 
              src={message.imageUrl} 
              alt="Uploaded content"
              className="max-w-full h-auto rounded-md md:rounded-lg border"
            />
          </div>
        )}
        
        <div className="text-xs md:text-sm leading-tight md:leading-relaxed">
          {renderContent(message.content)}
        </div>
        
        <div className={cn(
          "flex items-center justify-between mt-1 md:mt-2 pt-1 md:pt-2 border-t text-[10px] md:text-xs opacity-50 md:opacity-60",
          isUser ? "border-primary-foreground/20" : "border-border"
        )}>
          <span className="truncate">{formatTimestamp(message.timestamp)}</span>
          {message.model && !isUser && (
            <span className="font-medium hidden sm:inline text-[9px] md:text-xs">{message.model}</span>
          )}
        </div>
        
        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="absolute top-1 md:top-2 right-1 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 md:h-6 md:w-6 p-0"
          >
            <Copy className="w-2 h-2 md:w-3 md:h-3" />
          </Button>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-5 h-5 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="w-2.5 h-2.5 md:w-4 md:h-4 text-accent" />
        </div>
      )}
    </div>
  );
}
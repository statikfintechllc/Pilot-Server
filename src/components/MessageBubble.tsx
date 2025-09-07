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
              <code key={`inline-${i}-${j}`} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
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
          <div key={`code-${i}`} className="my-3 rounded-lg border bg-muted/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {language || 'code'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(code)}
                className="h-6 px-2 text-xs"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="p-3 overflow-x-auto">
              <code className="text-sm font-mono leading-relaxed">{code}</code>
            </pre>
          </div>
        );
      }
    }
    
    return result.length > 0 ? result : <span className="whitespace-pre-wrap">{content}</span>;
  };

  return (
    <div className={cn(
      "flex gap-2 md:gap-3 p-2 md:p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Robot className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2.5 md:py-3 relative group",
        isUser 
          ? "bg-primary text-primary-foreground ml-8 md:ml-12" 
          : "bg-card border shadow-sm"
      )}>
        {message.imageUrl && (
          <div className="mb-2 md:mb-3">
            <img 
              src={message.imageUrl} 
              alt="Uploaded content"
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}
        
        <div className="text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>
        
        <div className={cn(
          "flex items-center justify-between mt-2 pt-1.5 md:pt-2 border-t text-xs opacity-60",
          isUser ? "border-primary-foreground/20" : "border-border"
        )}>
          <span>{formatTimestamp(message.timestamp)}</span>
          {message.model && !isUser && (
            <span className="font-medium hidden sm:inline">{message.model}</span>
          )}
        </div>
        
        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="absolute top-1.5 md:top-2 right-1.5 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
        </div>
      )}
    </div>
  );
}
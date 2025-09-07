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
    
    // Split content into code blocks and text
    const parts = processedContent.split(codeBlockRegex);
    const result: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i += 3) {
      if (parts[i]) {
        const textPart = parts[i].trim();
        if (textPart) {
          result.push(
            <div key={`text-${i}`} className="formatted-content">
              {formatTextContent(textPart)}
            </div>
          );
        }
      }
      
      if (parts[i + 1] && parts[i + 2]) {
        const language = parts[i + 1];
        const code = parts[i + 2];
        result.push(
          <div key={`code-${i}`} className="my-3 md:my-4 rounded-lg border bg-muted/30 overflow-hidden">
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
    
    return result.length > 0 ? result : <div className="formatted-content">{formatTextContent(content)}</div>;
  };

  const formatTextContent = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, pIndex) => {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) return null;

      // Check for headers (lines starting with #)
      if (trimmedParagraph.startsWith('#')) {
        const headerMatch = trimmedParagraph.match(/^(#{1,6})\s*(.+)/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const headerText = headerMatch[2];
          const HeaderTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
          return (
            <HeaderTag key={pIndex} className={cn(
              "font-semibold mt-4 mb-2 first:mt-0",
              level === 1 && "text-lg md:text-xl",
              level === 2 && "text-base md:text-lg",
              level >= 3 && "text-sm md:text-base"
            )}>
              {formatInlineText(headerText)}
            </HeaderTag>
          );
        }
      }

      // Check for bullet points (lines starting with - or *)
      const lines = trimmedParagraph.split('\n');
      const isList = lines.every(line => line.trim().match(/^[-*]\s+/) || line.trim() === '');
      
      if (isList) {
        const listItems = lines
          .filter(line => line.trim().match(/^[-*]\s+/))
          .map((line, index) => {
            const content = line.replace(/^[-*]\s+/, '').trim();
            return (
              <li key={index} className="mb-1 leading-relaxed">
                {formatInlineText(content)}
              </li>
            );
          });
        
        return (
          <ul key={pIndex} className="list-disc list-inside space-y-1 my-2 pl-2">
            {listItems}
          </ul>
        );
      }

      // Check for numbered lists
      const isNumberedList = lines.every(line => line.trim().match(/^\d+\.\s+/) || line.trim() === '');
      
      if (isNumberedList) {
        const listItems = lines
          .filter(line => line.trim().match(/^\d+\.\s+/))
          .map((line, index) => {
            const content = line.replace(/^\d+\.\s+/, '').trim();
            return (
              <li key={index} className="mb-1 leading-relaxed">
                {formatInlineText(content)}
              </li>
            );
          });
        
        return (
          <ol key={pIndex} className="list-decimal list-inside space-y-1 my-2 pl-2">
            {listItems}
          </ol>
        );
      }

      // Regular paragraph
      return (
        <p key={pIndex} className="mb-3 leading-relaxed last:mb-0">
          {formatInlineText(trimmedParagraph)}
        </p>
      );
    }).filter(Boolean);
  };

  const formatInlineText = (text: string) => {
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = text.split(inlineCodeRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is inline code
        return (
          <code key={index} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
            {part}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn(
      "flex gap-2 md:gap-3 p-2 md:p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Robot className="w-3 h-3 md:w-4 md:h-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] md:max-w-[80%] rounded-lg md:rounded-2xl px-3 md:px-4 py-2 md:py-3 relative group",
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
        
        <div className="text-sm md:text-base leading-relaxed">
          {renderContent(message.content)}
        </div>
        
        <div className={cn(
          "flex items-center justify-between mt-2 pt-2 border-t text-xs opacity-60",
          isUser ? "border-primary-foreground/20" : "border-border"
        )}>
          <span className="truncate">{formatTimestamp(message.timestamp)}</span>
          {message.model && !isUser && (
            <span className="font-medium hidden sm:inline text-xs">{message.model}</span>
          )}
        </div>
        
        {!isUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="w-3 h-3 md:w-4 md:h-4 text-accent" />
        </div>
      )}
    </div>
  );
}
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperPlaneTilt, Image as ImageIcon, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((!message.trim() && !uploadedImage) || isLoading) return;
    
    onSendMessage(message, uploadedImage || undefined);
    setMessage('');
    setUploadedImage(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '40px'; // Reset to min height
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea and container
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, window.innerWidth < 768 ? 200 : 300);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // Check if the message contains complete code blocks
  const hasCompleteCodeBlocks = (text: string) => {
    const codeBlockMatches = text.match(/```/g);
    return codeBlockMatches && codeBlockMatches.length >= 2 && codeBlockMatches.length % 2 === 0;
  };

  // Check if we're currently inside a code block
  const isInCodeBlock = (text: string, cursorPosition: number) => {
    const beforeCursor = text.substring(0, cursorPosition);
    const codeBlockMatches = beforeCursor.match(/```/g);
    return codeBlockMatches && codeBlockMatches.length % 2 === 1;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm input-container">
      {uploadedImage && (
        <div className="p-2 md:p-4 border-b">
          <div className="relative inline-block">
            <img 
              src={uploadedImage} 
              alt="Upload preview" 
              className="max-w-xs max-h-16 md:max-h-32 rounded-md md:rounded-lg border object-cover"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={removeImage}
              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-4 w-4 md:h-6 md:w-6 rounded-full p-0"
            >
              <X className="w-2 h-2 md:w-3 md:h-3" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex-shrink-0 h-10 w-10 p-0 self-end"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message... (Use ``` for code blocks)"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={cn(
              "resize-none min-h-[40px] max-h-48 md:max-h-72 text-sm border-border/50 focus:border-ring/50 transition-all pr-12",
              hasCompleteCodeBlocks(message) ? "font-mono" : ""
            )}
            rows={1}
            style={{
              fontFamily: hasCompleteCodeBlocks(message) 
                ? "'JetBrains Mono', 'Courier New', monospace" 
                : "'Inter', system-ui, -apple-system, sans-serif"
            }}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={(!message.trim() && !uploadedImage) || isLoading}
            size="sm"
            className={cn(
              "absolute right-1 bottom-1 h-8 w-8 p-0 transition-all",
              (!message.trim() && !uploadedImage) || isLoading 
                ? "opacity-50" 
                : "opacity-100 hover:scale-105"
            )}
          >
            <PaperPlaneTilt className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
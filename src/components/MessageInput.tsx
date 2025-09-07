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
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    <div className="border-t bg-background/95 backdrop-blur-sm">
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
      
      <div className="flex items-end gap-1.5 md:gap-3 p-2 md:p-4">
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
          className="flex-shrink-0 h-8 md:h-10 w-8 md:w-10 p-0"
        >
          <ImageIcon className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message... (Use ``` for code blocks)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={cn(
              "resize-none min-h-[32px] md:min-h-[44px] max-h-32 md:max-h-48 pr-8 md:pr-12 text-xs md:text-sm",
              message.includes('```') ? "font-mono" : ""
            )}
            rows={1}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={(!message.trim() && !uploadedImage) || isLoading}
            size="sm"
            className={cn(
              "absolute right-1 md:right-2 bottom-1 md:bottom-2 h-5 w-5 md:h-8 md:w-8 p-0 transition-all",
              (!message.trim() && !uploadedImage) || isLoading 
                ? "opacity-50" 
                : "opacity-100 hover:scale-105"
            )}
          >
            <PaperPlaneTilt className="w-2.5 h-2.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
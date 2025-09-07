import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { MessageInput } from '@/components/MessageInput';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ModelBubble } from '@/components/ModelBubble';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

function App() {
  const {
    chats,
    currentChat,
    chatState,
    createNewChat,
    selectChat,
    setModel,
    deleteChat,
    editMessage,
    sendMessage
  } = useChat();

  // Enhanced ResizeObserver error suppression
  useEffect(() => {
    // Suppress ResizeObserver errors in console
    const originalConsoleError = window.console.error;
    window.console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('ResizeObserver loop completed with undelivered notifications') ||
           message.includes('ResizeObserver loop limit exceeded'))) {
        return; // Suppress these specific errors
      }
      originalConsoleError.apply(console, args);
    };

    // Handle error events
    const handleError = (event: ErrorEvent) => {
      if (event.message && 
          (event.message.includes('ResizeObserver loop completed with undelivered notifications') ||
           event.message.includes('ResizeObserver loop limit exceeded'))) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'string' && 
          (event.reason.includes('ResizeObserver loop completed with undelivered notifications') ||
           event.reason.includes('ResizeObserver loop limit exceeded'))) {
        event.preventDefault();
        return false;
      }
    };

    // Add global ResizeObserver polyfill that's more stable
    if (window.ResizeObserver && !window.ResizeObserver.toString().includes('polyfill')) {
      const OriginalResizeObserver = window.ResizeObserver;
      window.ResizeObserver = class extends OriginalResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          super((entries, observer) => {
            try {
              // Use requestAnimationFrame to prevent loop issues
              requestAnimationFrame(() => {
                callback(entries, observer);
              });
            } catch (error) {
              // Silently handle ResizeObserver errors
              if (!(error instanceof Error) || 
                  !error.message.includes('ResizeObserver loop')) {
                throw error;
              }
            }
          });
        }
      };
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleNewChat = () => {
    createNewChat();
  };

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="h-screen flex bg-background overflow-hidden">
          <ChatSidebar
            chats={chats}
            currentChatId={chatState.currentChatId}
            onSelectChat={selectChat}
            onDeleteChat={deleteChat}
            onNewChat={handleNewChat}
          />
          
          <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
            <ChatHeader
              onNewChat={handleNewChat}
              isLoading={chatState.isLoading}
            />
            
            {/* Floating Model Selector Bubble */}
            <ModelBubble
              selectedModel={chatState.selectedModel}
              onModelChange={setModel}
              isLoading={chatState.isLoading}
            />
            
            <ChatMessages
              messages={currentChat?.messages || []}
              isLoading={chatState.isLoading}
              onEditMessage={editMessage}
            />
            
            <MessageInput
              onSendMessage={sendMessage}
              isLoading={chatState.isLoading}
            />
          </div>
          
          <Toaster position="top-right" />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
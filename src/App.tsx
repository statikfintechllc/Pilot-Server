import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { MessageInput } from '@/components/MessageInput';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ModelBubble } from '@/components/ModelBubble';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
    sendMessage
  } = useChat();

  // Global ResizeObserver error suppression
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'string' && 
          event.reason.includes('ResizeObserver loop completed with undelivered notifications')) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleNewChat = () => {
    createNewChat();
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex bg-background overflow-hidden">
        <ChatSidebar
          chats={chats}
          currentChatId={chatState.currentChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onNewChat={handleNewChat}
        />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
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
          />
          
          <MessageInput
            onSendMessage={sendMessage}
            isLoading={chatState.isLoading}
          />
        </div>
        
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
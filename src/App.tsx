import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { MessageInput } from '@/components/MessageInput';
import { ChatSidebar } from '@/components/ChatSidebar';
import { Toaster } from '@/components/ui/sonner';

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

  const handleNewChat = () => {
    createNewChat();
  };

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar
        chats={chats}
        currentChatId={chatState.currentChatId}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedModel={chatState.selectedModel}
          onModelChange={setModel}
          onNewChat={handleNewChat}
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
  );
}

export default App;
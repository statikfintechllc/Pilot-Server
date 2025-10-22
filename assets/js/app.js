// Pilot Server - Main Application JavaScript

// Theme management
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  if (newTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

// Chat state management
const chatState = {
  chats: [],
  currentChatId: null,
  selectedModel: 'gpt-4o',
  
  // Load state from localStorage
  load() {
    const saved = localStorage.getItem('pilot-chat-state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.chats = data.chats || [];
        this.currentChatId = data.currentChatId || null;
        this.selectedModel = data.selectedModel || 'gpt-4o';
      } catch (e) {
        console.error('Failed to load chat state:', e);
      }
    }
  },
  
  // Save state to localStorage
  save() {
    const data = {
      chats: this.chats,
      currentChatId: this.currentChatId,
      selectedModel: this.selectedModel
    };
    localStorage.setItem('pilot-chat-state', JSON.stringify(data));
  },
  
  // Create new chat
  createChat() {
    const chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    this.chats.push(chat);
    this.currentChatId = chat.id;
    this.save();
    return chat;
  },
  
  // Get current chat
  getCurrentChat() {
    return this.chats.find(c => c.id === this.currentChatId);
  },
  
  // Add message to current chat
  addMessage(message) {
    const chat = this.getCurrentChat();
    if (chat) {
      chat.messages.push(message);
      this.save();
    }
  }
};

// Initialize application
function startNewChat() {
  chatState.createChat();
  renderChat();
}

function renderChat() {
  const chat = chatState.getCurrentChat();
  const messagesContainer = document.getElementById('chat-messages');
  
  if (!messagesContainer) return;
  
  if (!chat || chat.messages.length === 0) {
    messagesContainer.innerHTML = '<div class="text-center text-muted-foreground p-8">Start a new conversation</div>';
    return;
  }
  
  messagesContainer.innerHTML = chat.messages.map(msg => `
    <div class="message message-${msg.role} p-4 mb-4">
      <div class="font-bold">${msg.role === 'user' ? 'You' : 'AI'}</div>
      <div class="mt-2">${msg.content}</div>
    </div>
  `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  chatState.load();
  
  // If no chats exist, create one
  if (chatState.chats.length === 0) {
    chatState.createChat();
  }
  
  renderChat();
});

// Export for use in other scripts
window.PilotApp = {
  toggleTheme,
  startNewChat,
  chatState
};

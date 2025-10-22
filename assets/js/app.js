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
  isLoading: false,
  
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
      createdAt: new Date().toISOString(),
      lastUpdated: Date.now()
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
      chat.lastUpdated = Date.now();
      // Update title based on first message
      if (chat.messages.length === 1 && message.role === 'user') {
        chat.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      }
      this.save();
    }
  },
  
  // Delete chat
  deleteChat(chatId) {
    const index = this.chats.findIndex(c => c.id === chatId);
    if (index > -1) {
      this.chats.splice(index, 1);
      if (this.currentChatId === chatId) {
        this.currentChatId = this.chats.length > 0 ? this.chats[0].id : null;
      }
      this.save();
    }
  },
  
  // Select chat
  selectChat(chatId) {
    this.currentChatId = chatId;
    this.save();
  }
};

// Sidebar management
function toggleSidebar() {
  const sidebar = document.getElementById('chat-sidebar');
  const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true';
  sidebar.setAttribute('data-collapsed', (!isCollapsed).toString());
  if (isCollapsed) {
    sidebar.classList.remove('md:w-16');
    sidebar.classList.add('md:w-72');
  } else {
    sidebar.classList.remove('md:w-72');
    sidebar.classList.add('md:w-16');
  }
}

function openSidebar() {
  const sidebar = document.getElementById('chat-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
}

function closeSidebar() {
  const sidebar = document.getElementById('chat-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

// Chat list rendering
function renderChatList() {
  const chatListContainer = document.getElementById('chat-list');
  if (!chatListContainer) return;
  
  const sortedChats = [...chatState.chats].sort((a, b) => b.lastUpdated - a.lastUpdated);
  
  if (sortedChats.length === 0) {
    chatListContainer.innerHTML = '<div class="text-center text-muted-foreground p-4">No conversations yet</div>';
    return;
  }
  
  chatListContainer.innerHTML = sortedChats.map(chat => {
    const isActive = chat.id === chatState.currentChatId;
    return `
      <div class="chat-item mb-1 p-2 rounded-lg cursor-pointer hover:bg-muted/50 ${isActive ? 'bg-muted' : ''}" 
           onclick="PilotApp.selectChatById('${chat.id}')">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm truncate">${chat.title}</div>
            <div class="text-xs text-muted-foreground">${formatTimestamp(chat.lastUpdated)}</div>
          </div>
          <button 
            class="ml-2 text-destructive hover:text-destructive/80"
            onclick="event.stopPropagation(); PilotApp.deleteChatById('${chat.id}')"
            title="Delete chat"
          >
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Chat rendering
function startNewChat() {
  chatState.createChat();
  renderChat();
  renderChatList();
  closeSidebar(); // Close on mobile
}

function selectChatById(chatId) {
  chatState.selectChat(chatId);
  renderChat();
  renderChatList();
  closeSidebar(); // Close on mobile
}

function deleteChatById(chatId) {
  if (confirm('Are you sure you want to delete this chat?')) {
    chatState.deleteChat(chatId);
    renderChat();
    renderChatList();
  }
}

function renderChat() {
  const chat = chatState.getCurrentChat();
  const messagesContainer = document.getElementById('chat-messages');
  
  if (!messagesContainer) return;
  
  if (!chat || chat.messages.length === 0) {
    messagesContainer.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center text-muted-foreground p-8">
          <div class="text-4xl mb-4">💬</div>
          <div class="text-lg font-semibold mb-2">Start a new conversation</div>
          <div class="text-sm">Type a message below to get started</div>
        </div>
      </div>
    `;
    return;
  }
  
  messagesContainer.innerHTML = chat.messages.map(msg => `
    <div class="message message-${msg.role} mb-4 p-4 rounded-lg ${msg.role === 'assistant' ? 'bg-muted' : 'bg-card border border-border'}">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}">
          ${msg.role === 'assistant' ? '🤖' : '👤'}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm mb-1">
            ${msg.role === 'assistant' ? 'AI Assistant' : 'You'}
          </div>
          <div class="prose prose-sm max-w-none whitespace-pre-wrap">${escapeHtml(msg.content)}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Message sending
function sendMessage(event) {
  event.preventDefault();
  
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  
  if (!content || chatState.isLoading) return false;
  
  // Add user message
  chatState.addMessage({
    role: 'user',
    content: content,
    timestamp: new Date().toISOString()
  });
  
  input.value = '';
  input.style.height = 'auto';
  renderChat();
  renderChatList();
  
  // Show loading indicator
  showLoading(true);
  
  // Simulate AI response (in a real app, this would call an API)
  setTimeout(() => {
    chatState.addMessage({
      role: 'assistant',
      content: 'This is a demo response. To connect to a real AI service, you would need to integrate with an API like OpenAI, Anthropic, or a local model.',
      timestamp: new Date().toISOString()
    });
    
    renderChat();
    renderChatList();
    showLoading(false);
  }, 1000);
  
  return false;
}

function showLoading(show) {
  chatState.isLoading = show;
  const loadingIndicator = document.getElementById('loading-indicator');
  const sendButton = document.getElementById('send-button');
  
  if (loadingIndicator) {
    loadingIndicator.classList.toggle('hidden', !show);
  }
  
  if (sendButton) {
    sendButton.disabled = show;
    sendButton.textContent = show ? 'Sending...' : 'Send';
  }
}

function handleInputKeydown(event) {
  const textarea = event.target;
  
  // Ctrl/Cmd + Enter to send
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    sendMessage(event);
    return;
  }
  
  // Auto-resize textarea
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function changeModel(model) {
  chatState.selectedModel = model;
  chatState.save();
}

function openSettings() {
  alert('Settings dialog would open here. In a real implementation, this would show a modal with configuration options.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  chatState.load();
  
  // Initialize model selector
  const modelSelector = document.getElementById('model-selector');
  if (modelSelector) {
    modelSelector.value = chatState.selectedModel;
  }
  
  // If no chats exist, create one
  if (chatState.chats.length === 0) {
    chatState.createChat();
  }
  
  renderChat();
  renderChatList();
});

// Export for use in other scripts
window.PilotApp = {
  toggleTheme,
  startNewChat,
  chatState,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  selectChatById,
  deleteChatById,
  sendMessage,
  handleInputKeydown,
  changeModel,
  openSettings
};

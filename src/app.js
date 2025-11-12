// ===== STATE MANAGEMENT =====
const state = {
  chats: JSON.parse(localStorage.getItem('pilot-chats') || '[]'),
  currentChatId: null,
  selectedModel: 'GPT 4o',
  messages: []
};

function saveState() {
  localStorage.setItem('pilot-chats', JSON.stringify(state.chats));
}

function setState(updates) {
  Object.assign(state, updates);
  saveState();
  render();
}

// ===== CHAT FUNCTIONS =====
function createNewChat() {
  const newChat = {
    id: 'chat-' + Date.now(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now()
  };
  
  state.chats.unshift(newChat);
  state.currentChatId = newChat.id;
  state.messages = [];
  saveState();
  render();
}

function selectChat(chatId) {
  const chat = state.chats.find(c => c.id === chatId);
  if (chat) {
    state.currentChatId = chatId;
    state.messages = chat.messages || [];
    render();
  }
}

function deleteChat(chatId) {
  if (confirm('Delete this chat?')) {
    state.chats = state.chats.filter(c => c.id !== chatId);
    if (state.currentChatId === chatId) {
      state.currentChatId = state.chats[0]?.id || null;
      state.messages = state.chats[0]?.messages || [];
    }
    saveState();
    render();
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const content = input.value.trim();
  
  if (!content) return;
  
  // Create chat if none exists
  if (!state.currentChatId) {
    createNewChat();
  }
  
  // Add user message
  const userMessage = {
    id: 'msg-' + Date.now(),
    role: 'user',
    content: content,
    timestamp: Date.now()
  };
  
  state.messages.push(userMessage);
  
  // Update chat
  state.chats = state.chats.map(chat => {
    if (chat.id === state.currentChatId) {
      const updatedMessages = [...(chat.messages || []), userMessage];
      return {
        ...chat,
        messages: updatedMessages,
        title: chat.title === 'New Chat' && updatedMessages.length === 1
          ? content.substring(0, 50) + (content.length > 50 ? '...' : '')
          : chat.title
      };
    }
    return chat;
  });
  
  input.value = '';
  saveState();
  render();
  
  // Simulate AI response
  setTimeout(() => {
    const aiMessage = {
      id: 'msg-' + Date.now() + '-ai',
      role: 'assistant',
      content: 'This is a demo response. To get real AI responses, add your API key in the settings.',
      timestamp: Date.now()
    };
    
    state.messages.push(aiMessage);
    
    state.chats = state.chats.map(chat => {
      if (chat.id === state.currentChatId) {
        return {
          ...chat,
          messages: [...(chat.messages || []), aiMessage]
        };
      }
      return chat;
    });
    
    saveState();
    render();
  }, 1000);
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// ===== MODEL DROPDOWN =====
function toggleModelDropdown() {
  const dropdown = document.getElementById('modelDropdown');
  dropdown.classList.toggle('hidden');
}

function selectModel(model) {
  state.selectedModel = model;
  document.getElementById('selectedModel').textContent = model;
  document.getElementById('modelDropdown').classList.add('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('modelDropdown');
  const button = event.target.closest('button[onclick="toggleModelDropdown()"]');
  
  if (!button && dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.add('hidden');
  }
});

// ===== RENDERING =====
function renderChatList() {
  const chatList = document.getElementById('chatList');
  
  if (state.chats.length === 0) {
    chatList.innerHTML = `
      <div class="text-center text-gray-400 text-sm py-8">
        No chats yet.<br>Click "New Chat" to start!
      </div>
    `;
    return;
  }
  
  chatList.innerHTML = state.chats.map(chat => `
    <div class="glass p-3 rounded-lg mb-2 cursor-pointer hover:bg-white/10 transition ${
      chat.id === state.currentChatId ? 'bg-white/10 border border-blue-500' : ''
    }" onclick="selectChat('${chat.id}')">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-sm truncate">${chat.title}</h3>
          <p class="text-xs text-gray-400 mt-1">${(chat.messages || []).length} messages</p>
        </div>
        <button onclick="event.stopPropagation(); deleteChat('${chat.id}')" 
                class="ml-2 text-red-400 hover:text-red-300 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function renderMessages() {
  const messagesDiv = document.getElementById('messages');
  
  if (state.messages.length === 0) {
    messagesDiv.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center text-gray-400">
          <svg class="w-16 h-16 mx-auto opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <p class="text-lg">Start a conversation</p>
          <p class="text-sm mt-2">Type a message below to begin</p>
        </div>
      </div>
    `;
    return;
  }
  
  messagesDiv.innerHTML = state.messages.map(msg => `
    <div class="mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}">
      <div class="max-w-3xl ${msg.role === 'user' ? 'ml-12' : 'mr-12'}">
        <div class="text-xs text-gray-400 mb-1">
          ${msg.role === 'user' ? 'You' : 'Assistant'}
        </div>
        <div class="glass p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-600/20' : 'bg-white/5'}">
          <p class="text-white whitespace-pre-wrap">${escapeHtml(msg.content)}</p>
        </div>
      </div>
    </div>
  `).join('');
  
  // Auto scroll to bottom
  setTimeout(() => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 0);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function render() {
  renderChatList();
  renderMessages();
}

// ===== INIT =====
function init() {
  console.log('Pilot Server initialized');
  
  // Create initial chat if none exist
  if (state.chats.length === 0) {
    createNewChat();
  } else if (!state.currentChatId && state.chats.length > 0) {
    state.currentChatId = state.chats[0].id;
    state.messages = state.chats[0].messages || [];
  }
  
  render();
}

// Start the app
init();

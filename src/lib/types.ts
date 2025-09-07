export interface MessageVersion {
  content: string;
  timestamp: number;
  model?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  model?: string;
  imageUrl?: string;
  fileData?: {
    name: string;
    url: string;
    type: string;
  };
  isEdited?: boolean;
  editedAt?: number;
  versions?: MessageVersion[];
  currentVersionIndex?: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastUpdated: number;
}

export type AIModel = 'gpt-4o' | 'gpt-4o-mini';

export interface ChatState {
  currentChatId: string | null;
  selectedModel: AIModel;
  isLoading: boolean;
}
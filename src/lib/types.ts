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

export type AIModel = 
  // OpenAI Models
  | 'gpt-4o' 
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  // Anthropic Models
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  // Meta Models
  | 'llama-3.1-405b-instruct'
  | 'llama-3.1-70b-instruct'
  | 'llama-3.1-8b-instruct'
  // Google Models
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  // Microsoft Models
  | 'phi-3-medium-4k-instruct'
  | 'phi-3-mini-4k-instruct'
  // Cohere Models
  | 'command-r'
  | 'command-r-plus'
  // Mistral Models
  | 'mistral-large'
  | 'mistral-small';

export interface ChatState {
  currentChatId: string | null;
  selectedModel: AIModel;
  isLoading: boolean;
}
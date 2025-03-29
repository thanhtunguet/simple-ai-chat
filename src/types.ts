export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface Settings {
  apiKey: string;
  baseUrl: string;
  model: string;
}
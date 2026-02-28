export interface Message {
  id?: string;
  role: 'user' | 'model' | 'system'; // Gemini 'assistant' ki jagah 'model' use karta hai
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
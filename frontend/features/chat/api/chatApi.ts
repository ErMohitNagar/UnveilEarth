import { apiClient } from '@/lib/apiClient';

export interface ChatMessageData {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessageData[];
  destinationId?: string;
}

export const chatApi = {
  streamChat: (data: ChatRequest) => {
    // Uses our custom stream generator from apiClient
    return apiClient.stream('/api/chat', data);
  }
};

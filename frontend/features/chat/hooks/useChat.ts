import { useState, useCallback } from 'react';
import { chatApi, ChatMessageData } from '../api/chatApi';

export function useChat(destinationId?: string) {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI travel assistant. Ask me anything about destinations, hidden gems, or travel advice.',
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const newMessages: ChatMessageData[] = [
      ...messages,
      { role: 'user', content }
    ];
    setMessages(newMessages);
    setIsStreaming(true);
    setError(null);

    // Add empty assistant message that will be populated by stream
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = await chatApi.streamChat({
        messages: newMessages,
        destinationId,
      });

      for await (const chunk of stream) {
        if (chunk.content) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role === 'assistant') {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + chunk.content }
              ];
            }
            return prev;
          });
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message');
      // Remove the empty assistant message on error
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, destinationId]);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
  };
}

import { genaiClient } from '../../services/genai/genai.client.js';
import { buildChatSystemPrompt } from '../../services/genai/prompts/chat.prompt.js';
import { moderationService } from '../../services/moderation/contentModeration.service.js';
import logger from '../../utils/logger.js';
import { AppError } from '../../utils/apiResponse.js';
import type { ChatMessage } from '../../services/genai/genai.client.js';

interface UserContext {
  name?: string;
  preferences?: Record<string, unknown>;
}

export const chatService = {
  /**
   * Builds the full message context and returns a streaming response
   * from the GenAI provider (Groq primary, Gemini fallback).
   */
  async streamChatResponse(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    userContext?: UserContext,
  ) {
    // Sanitize the latest user message for prompt injection
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const sanitized = moderationService.sanitizeForPrompt(lastMessage.content);
      if (!moderationService.isContentSafe(sanitized)) {
        throw new AppError('Message contains inappropriate content', 400, 'CONTENT_UNSAFE');
      }
    }

    // Build system prompt with user context
    const systemPrompt = buildChatSystemPrompt(userContext);

    // Construct full message array with system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    logger.debug(
      { messageCount: fullMessages.length },
      '[chat] Starting streaming chat response',
    );

    // Stream via genaiClient (Groq primary → Gemini fallback)
    const stream = await genaiClient.streamChat(fullMessages);
    return stream;
  },
};

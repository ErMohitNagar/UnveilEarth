import Groq from 'groq-sdk';
import { env } from '../../config/env.js';
import { CONSTANTS } from '../../config/constants.js';
import type { GenerateOptions } from './gemini.provider.js';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const groqProvider = {
  async generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const completion = await groq.chat.completions.create({
      messages: [
        ...(options.systemInstruction ? [{ role: 'system' as const, content: options.systemInstruction }] : []),
        { role: 'user' as const, content: prompt },
      ],
      model: CONSTANTS.GENAI.GROQ_CHAT_MODEL,
      max_tokens: options.maxTokens ?? CONSTANTS.GENAI.MAX_CONTENT_TOKENS,
      temperature: options.temperature ?? 0.7,
    });
    return completion.choices[0]?.message?.content ?? '';
  },

  async streamChat(messages: ChatMessage[]) {
    return groq.chat.completions.create({
      messages,
      model: CONSTANTS.GENAI.GROQ_CHAT_MODEL,
      max_tokens: CONSTANTS.GENAI.MAX_CHAT_TOKENS,
      temperature: 0.7,
      stream: true,
    });
  },
};

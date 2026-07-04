import { geminiProvider } from './gemini.provider.js';
import { groqProvider } from './groq.provider.js';
import { CONSTANTS } from '../../config/constants.js';
import logger from '../../utils/logger.js';
import type { GenerateOptions } from './gemini.provider.js';
import type { ChatMessage } from './groq.provider.js';

export type { GenerateOptions } from './gemini.provider.js';
export type { ChatMessage } from './groq.provider.js';

interface GenAIProviders {
  gemini: typeof geminiProvider;
  groq: typeof groqProvider;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createGenAIClient(providers?: Partial<GenAIProviders>) {
  const gemini = providers?.gemini ?? geminiProvider;
  const groq = providers?.groq ?? groqProvider;

  async function withRetry<T>(
    operation: () => Promise<T>,
    label: string,
    maxRetries: number = CONSTANTS.GENAI.MAX_RETRIES,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const backoffMs = Math.min(1000 * 2 ** (attempt - 1), 16_000);

        logger.warn(
          { attempt, maxRetries, backoffMs, error: (error as Error).message },
          `[genai] ${label} attempt ${attempt}/${maxRetries} failed, retrying in ${backoffMs}ms`,
        );

        if (attempt < maxRetries) {
          await sleep(backoffMs);
        }
      }
    }

    throw lastError;
  }

  return {
    /**
     * Generate text content. Tries Gemini first, falls back to Groq on failure.
     */
    async generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
      return withRetry(async () => {
        try {
          const result = await gemini.generateContent(prompt, options);
          logger.debug('[genai] Content generated via Gemini');
          return result;
        } catch (geminiError) {
          logger.warn(
            { error: (geminiError as Error).message },
            '[genai] Gemini generateContent failed, falling back to Groq',
          );

          const result = await groq.generateContent(prompt, options);
          logger.debug('[genai] Content generated via Groq (fallback)');
          return result;
        }
      }, 'generateContent');
    },

    /**
     * Generate an embedding vector. Gemini only — Groq does not support embeddings.
     */
    async generateEmbedding(text: string): Promise<number[]> {
      return withRetry(async () => {
        const result = await gemini.generateEmbedding(text);
        logger.debug({ dimensions: result.length }, '[genai] Embedding generated via Gemini');
        return result;
      }, 'generateEmbedding');
    },

    /**
     * Generate embeddings for multiple texts in a single batch.
     */
    async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
      return withRetry(async () => {
        const results = await gemini.generateEmbeddingsBatch(texts);
        logger.debug({ count: results.length }, '[genai] Batch embeddings generated via Gemini');
        return results;
      }, 'generateEmbeddingsBatch');
    },

    /**
     * Stream a chat conversation. Tries Groq first (lower latency), falls back to Gemini.
     */
    async streamChat(messages: ChatMessage[]) {
      try {
        const stream = await groq.streamChat(messages);
        logger.debug('[genai] Chat stream opened via Groq');
        return stream;
      } catch (groqError) {
        logger.warn(
          { error: (groqError as Error).message },
          '[genai] Groq streamChat failed, falling back to Gemini',
        );

        // Gemini fallback: reconstruct as a single prompt and stream-like response
        const systemMsg = messages.find(m => m.role === 'system');
        const userMessages = messages.filter(m => m.role !== 'system');
        const combinedPrompt = userMessages.map(m => `${m.role}: ${m.content}`).join('\n\n');

        const result = await gemini.generateContent(combinedPrompt, {
          systemInstruction: systemMsg?.content,
        });

        logger.debug('[genai] Chat response generated via Gemini (fallback, non-streaming)');

        // Return an async iterable that yields a single chunk to match stream interface
        async function* singleChunkStream() {
          yield {
            choices: [{ delta: { content: result }, finish_reason: 'stop' as const }],
          };
        }

        return singleChunkStream();
      }
    },
  };
}

export const genaiClient = createGenAIClient();
export { createGenAIClient };

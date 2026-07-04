import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { CONSTANTS } from '../../config/constants.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  systemInstruction?: string;
}

export const geminiProvider = {
  async generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const response = await ai.models.generateContent({
      model: CONSTANTS.GENAI.GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: options.maxTokens ?? CONSTANTS.GENAI.MAX_CONTENT_TOKENS,
        temperature: options.temperature ?? 0.7,
        ...(options.systemInstruction && { systemInstruction: options.systemInstruction }),
      },
    });
    return response.text ?? '';
  },

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await ai.models.embedContent({
      model: CONSTANTS.GENAI.EMBEDDING_MODEL,
      contents: text,
      config: { outputDimensionality: CONSTANTS.GENAI.EMBEDDING_DIMENSIONS },
    });
    return response.embeddings?.[0]?.values ?? [];
  },

  async generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    const results = await Promise.all(texts.map(text => geminiProvider.generateEmbedding(text)));
    return results;
  },
};

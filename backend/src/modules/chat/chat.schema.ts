import { z } from 'zod';

export const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(50),
  conversationId: z.string().uuid().optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

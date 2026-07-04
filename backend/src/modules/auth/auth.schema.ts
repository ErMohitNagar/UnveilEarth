import { z } from 'zod';

export const SyncUserSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  preferences: z
    .object({
      interests: z.array(z.string()).optional(),
      budgetRange: z.enum(['budget', 'moderate', 'luxury']).optional(),
      travelStyle: z
        .enum(['adventure', 'cultural', 'relaxation', 'culinary', 'eco'])
        .optional(),
      preferredRegions: z.array(z.string()).optional(),
    })
    .optional(),
});

export type SyncUserInput = z.infer<typeof SyncUserSchema>;

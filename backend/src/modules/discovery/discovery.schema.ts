import { z } from 'zod';

export const RecommendationRequestSchema = z.object({
  interests: z.array(z.string().min(1)).min(1).max(10),
  budget: z.enum(['budget', 'moderate', 'luxury']),
  travelStyle: z.enum(['adventure', 'cultural', 'relaxation', 'culinary', 'eco']),
  preferredRegions: z.array(z.string()).optional(),
  excludeSlugs: z.array(z.string()).optional(),
});

export const HiddenGemsRequestSchema = z.object({
  query: z.string().min(3).max(500),
  region: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export type RecommendationRequestInput = z.infer<typeof RecommendationRequestSchema>;
export type HiddenGemsRequestInput = z.infer<typeof HiddenGemsRequestSchema>;

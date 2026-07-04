import { z } from 'zod';

export const ListDestinationsQuerySchema = z.object({
  search: z.string().max(200).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const DestinationParamsSchema = z.object({
  slug: z.string().min(1).max(200),
});

export type ListDestinationsQuery = z.infer<typeof ListDestinationsQuerySchema>;
export type DestinationParams = z.infer<typeof DestinationParamsSchema>;

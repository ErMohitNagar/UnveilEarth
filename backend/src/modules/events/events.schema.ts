import { z } from 'zod';

export const ListEventsQuerySchema = z.object({
  destinationId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListEventsQuery = z.infer<typeof ListEventsQuerySchema>;

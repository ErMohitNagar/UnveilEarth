import { z } from 'zod';

export const ListExperiencesQuerySchema = z.object({
  destinationId: z.string().uuid().optional(),
  guideId: z.string().uuid().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ExperienceParamsSchema = z.object({
  id: z.string().uuid(),
});

export const BookingRequestSchema = z.object({
  bookingDate: z.string().min(1),
  participants: z.coerce.number().int().min(1).max(20),
  notes: z.string().max(500).optional(),
});

export type ListExperiencesQuery = z.infer<typeof ListExperiencesQuerySchema>;
export type ExperienceParams = z.infer<typeof ExperienceParamsSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;

import { z } from 'zod';

export const GuideOnboardSchema = z.object({
  bio: z.string().min(50).max(1000),
  specialties: z.array(z.string().min(1)).min(1).max(10),
  languages: z.array(z.string().min(1)).min(1).max(10),
  location: z.string().min(1).max(200),
  yearsOfExperience: z.coerce.number().int().min(0).max(50).optional(),
});

export type GuideOnboardInput = z.infer<typeof GuideOnboardSchema>;

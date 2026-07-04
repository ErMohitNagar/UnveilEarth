import { experiencesRepository } from './experiences.repository.js';
import type { ListExperiencesQuery } from './experiences.schema.js';

interface Experience {
  id: string;
  destinationId: string;
  guideId: string | null;
  title: string;
  description: string;
  durationHours: number | null;
  priceCents: number | null;
  currency: string;
  maxParticipants: number | null;
  imageUrl: string | null;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    destinationId: (row.destination_id as string) ?? '',
    guideId: (row.guide_id as string) ?? null,
    title: row.title as string,
    description: (row.description as string) ?? '',
    durationHours: (row.duration_hours as number) ?? null,
    priceCents: (row.price_cents as number) ?? null,
    currency: (row.currency as string) ?? 'USD',
    maxParticipants: (row.max_participants as number) ?? null,
    imageUrl: (row.image_url as string) ?? null,
    altText: (row.alt_text as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const experiencesService = {
  async list(filters: ListExperiencesQuery) {
    const { data, count } = await experiencesRepository.findAll(filters);

    return {
      data: data.map(mapExperience),
      total: count,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(count / filters.limit),
    };
  },

  async getById(id: string): Promise<Experience> {
    const row = await experiencesRepository.findById(id);
    return mapExperience(row);
  },
};

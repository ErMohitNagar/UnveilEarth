import { eventsRepository } from './events.repository.js';
import type { ListEventsQuery } from './events.schema.js';

interface Event {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  imageUrl: string | null;
  altText: string | null;
  createdAt: string;
}

function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    destinationId: (row.destination_id as string) ?? '',
    title: row.title as string,
    description: (row.description as string) ?? '',
    startDate: (row.start_date as string) ?? null,
    endDate: (row.end_date as string) ?? null,
    location: (row.location as string) ?? null,
    imageUrl: (row.image_url as string) ?? null,
    altText: (row.alt_text as string) ?? null,
    createdAt: row.created_at as string,
  };
}

export const eventsService = {
  async list(filters: ListEventsQuery) {
    const { data, count } = await eventsRepository.findAll(filters);

    return {
      data: data.map(mapEvent),
      total: count,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(count / filters.limit),
    };
  },
};

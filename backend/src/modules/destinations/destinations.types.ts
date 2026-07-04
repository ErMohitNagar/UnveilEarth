export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  region: string;
  country: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  altText: string | null;
  highlights: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationDetail extends Destination {
  aiStory: string | null;
  aiStoryGeneratedAt: string | null;
  relatedDestinations: Destination[];
}

export interface DestinationFilters {
  search?: string;
  region?: string;
  country?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

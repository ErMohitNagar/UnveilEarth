export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export interface RecommendationResult {
  name: string;
  slug: string;
  reason: string;
  matchScore: number;
  category: string;
}

export interface HiddenGemResult {
  id: string;
  name: string;
  description: string;
  region: string;
  similarity: number;
  aiSummary: string;
}

export interface Experience {
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

export interface Booking {
  id: string;
  userId: string;
  experienceId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  participants: number;
  totalPriceCents: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
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

import { apiClient } from '@/lib/apiClient';
import { Destination, PaginatedResponse, RecommendationResult, HiddenGemResult } from '@/types/api';

export interface GetDestinationsFilters {
  search?: string;
  region?: string;
  country?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetRecommendationsParams {
  interests: string[];
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'culinary' | 'eco';
  preferredRegions?: string[];
}

export interface SearchHiddenGemsParams {
  query: string;
  region?: string;
  category?: string;
  limit?: number;
}

export const discoveryApi = {
  getDestinations: (filters?: GetDestinationsFilters): Promise<Destination[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/destinations?${params.toString()}`);
  },

  getRecommendations: (params: GetRecommendationsParams): Promise<RecommendationResult[]> => {
    return apiClient.post('/api/discover/recommendations', params);
  },

  searchHiddenGems: (params: SearchHiddenGemsParams): Promise<HiddenGemResult[]> => {
    return apiClient.post('/api/discover/hidden-gems', params);
  }
};

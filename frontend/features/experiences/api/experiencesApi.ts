import { apiClient } from '@/lib/apiClient';
import { Experience, Booking } from '@/types/api';

export interface GetExperiencesFilters {
  destinationId?: string;
  guideId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreateBookingData {
  bookingDate: string;
  participants: number;
  notes?: string;
}

export const experiencesApi = {
  getExperiences: (filters?: GetExperiencesFilters): Promise<Experience[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/experiences?${params.toString()}`);
  },

  getExperienceById: (id: string): Promise<Experience> => {
    return apiClient.get(`/api/experiences/${id}`);
  },

  createBooking: (id: string, data: CreateBookingData): Promise<Booking> => {
    return apiClient.post(`/api/experiences/${id}/book`, data);
  }
};

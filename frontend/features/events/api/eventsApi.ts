import { apiClient } from '@/lib/apiClient';
import { Event, PaginatedResponse } from '@/types/api';

export interface GetEventsFilters {
  destinationId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const eventsApi = {
  getEvents: (filters?: GetEventsFilters): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    // Note: The backend schema returns PaginatedResponse for getEvents, but the apiClient handles 'data' extraction automatically in `fetchWithAuth`. 
    // Wait, the backend returns: { success: true, data: [...events], meta: { page, limit, total, totalPages } }. 
    // If apiClient extracts `json.data`, it returns `Event[]`.
    return apiClient.get(`/api/events?${params.toString()}`);
  }
};

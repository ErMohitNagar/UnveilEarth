import { apiClient } from '@/lib/apiClient';
import { DestinationDetail } from '@/types/api';

export const destinationApi = {
  getDestinationBySlug: (slug: string): Promise<DestinationDetail> => {
    return apiClient.get(`/api/destinations/${slug}`);
  }
};

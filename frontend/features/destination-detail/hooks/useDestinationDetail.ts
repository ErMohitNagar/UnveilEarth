import { useQuery } from '@tanstack/react-query';
import { destinationApi } from '../api/destinationApi';

export function useDestinationDetail(slug: string) {
  return useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationApi.getDestinationBySlug(slug),
    enabled: !!slug,
  });
}

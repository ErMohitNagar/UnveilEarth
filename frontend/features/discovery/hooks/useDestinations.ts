import { useQuery } from '@tanstack/react-query';
import { discoveryApi, GetDestinationsFilters } from '../api/discoveryApi';
import { Destination } from '@/types/api';

export function useDestinations(filters?: GetDestinationsFilters) {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => discoveryApi.getDestinations(filters),
  });
}

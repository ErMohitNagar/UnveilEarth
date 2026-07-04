import { useQuery } from '@tanstack/react-query';
import { eventsApi, GetEventsFilters } from '../api/eventsApi';

export function useEvents(filters?: GetEventsFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.getEvents(filters),
  });
}

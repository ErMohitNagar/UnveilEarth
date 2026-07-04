import { useQuery, useMutation } from '@tanstack/react-query';
import { experiencesApi, GetExperiencesFilters, CreateBookingData } from '../api/experiencesApi';

export function useExperiences(filters?: GetExperiencesFilters) {
  return useQuery({
    queryKey: ['experiences', filters],
    queryFn: () => experiencesApi.getExperiences(filters),
  });
}

export function useExperienceDetail(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => experiencesApi.getExperienceById(id),
    enabled: !!id,
  });
}

export function useBooking(experienceId: string) {
  return useMutation({
    mutationFn: (data: CreateBookingData) => experiencesApi.createBooking(experienceId, data),
  });
}

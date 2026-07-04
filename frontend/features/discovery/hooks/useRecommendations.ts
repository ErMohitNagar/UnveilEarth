import { useMutation } from '@tanstack/react-query';
import { discoveryApi, GetRecommendationsParams } from '../api/discoveryApi';
import { RecommendationResult } from '@/types/api';

export function useRecommendations() {
  return useMutation({
    mutationFn: (params: GetRecommendationsParams) => discoveryApi.getRecommendations(params),
  });
}

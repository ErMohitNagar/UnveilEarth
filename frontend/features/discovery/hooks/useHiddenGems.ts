import { useQuery } from '@tanstack/react-query';
import { discoveryApi, SearchHiddenGemsParams } from '../api/discoveryApi';

export function useHiddenGems(params: SearchHiddenGemsParams, enabled = true) {
  return useQuery({
    queryKey: ['hidden-gems', params],
    queryFn: () => discoveryApi.searchHiddenGems(params),
    enabled: enabled && !!params.query,
  });
}

import { useMutation } from '@tanstack/react-query';
import { authApi, SyncUserProfileInput } from '../api/authApi';

export function useSyncUserProfile() {
  return useMutation({
    mutationFn: (data: SyncUserProfileInput) => authApi.syncUserProfile(data),
  });
}

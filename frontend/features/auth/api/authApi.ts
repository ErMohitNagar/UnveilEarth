import { apiClient } from '@/lib/apiClient';

export interface SyncUserProfileInput {
  displayName?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}

export const authApi = {
  syncUserProfile: (data: SyncUserProfileInput) => {
    return apiClient.post('/api/auth/sync', data);
  }
};

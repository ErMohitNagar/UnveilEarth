import { supabase } from '../../db/supabaseClient.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { SyncUserInput } from './auth.schema.js';

export const authService = {
  /**
   * Upserts a Supabase-authenticated user into the local `users` profile table.
   * Called on first login or when the user updates their profile preferences.
   */
  async syncUser(userId: string, email: string, profileData: SyncUserInput) {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          email,
          display_name: profileData.displayName ?? null,
          avatar_url: profileData.avatarUrl ?? null,
          preferences: profileData.preferences ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, '[auth] Failed to sync user');
      throw new AppError('Failed to sync user profile', 500, 'USER_SYNC_ERROR');
    }

    logger.info({ userId }, '[auth] User synced successfully');
    return data;
  },
};

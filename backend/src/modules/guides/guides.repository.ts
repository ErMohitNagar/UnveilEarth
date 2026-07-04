import { supabase } from '../../db/supabaseClient.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { GuideOnboardInput } from './guides.schema.js';

export const guidesRepository = {
  async create(userId: string, data: GuideOnboardInput) {
    const { data: guide, error } = await supabase
      .from('guides')
      .insert({
        user_id: userId,
        bio: data.bio,
        specialties: data.specialties,
        languages: data.languages,
        location: data.location,
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, userId }, '[guides.repo] Failed to create guide');
      throw new AppError('Failed to create guide profile', 500, 'DB_INSERT_ERROR');
    }

    return guide;
  },

  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      logger.error({ error, userId }, '[guides.repo] findByUserId failed');
      throw new AppError('Failed to look up guide', 500, 'DB_QUERY_ERROR');
    }

    return data;
  },
};

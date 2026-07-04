import { supabase } from '../../db/supabaseClient.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { ListExperiencesQuery } from './experiences.schema.js';

export const experiencesRepository = {
  async findAll(filters: ListExperiencesQuery) {
    let query = supabase
      .from('experiences')
      .select('*', { count: 'exact' });

    if (filters.destinationId) {
      query = query.eq('destination_id', filters.destinationId);
    }

    if (filters.guideId) {
      query = query.eq('guide_id', filters.guideId);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price_cents', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price_cents', filters.maxPrice);
    }

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error({ error }, '[experiences.repo] findAll failed');
      throw new AppError('Failed to fetch experiences', 500, 'DB_QUERY_ERROR');
    }

    return { data: data ?? [], count: count ?? 0 };
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Experience not found', 404, 'EXPERIENCE_NOT_FOUND');
    }

    return data;
  },
};

import { supabase } from '../../db/supabaseClient.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { DestinationFilters } from './destinations.types.js';

export const destinationsRepository = {
  /**
   * Find all destinations with optional filters and pagination.
   * Returns { data, count } where count is the total matching rows.
   */
  async findAll(filters: DestinationFilters) {
    let query = supabase
      .from('destinations')
      .select('*', { count: 'exact' });

    // Text search across name and description
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      );
    }

    if (filters.region) {
      query = query.eq('region', filters.region);
    }

    if (filters.country) {
      query = query.eq('country', filters.country);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Pagination
    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error({ error }, '[destinations.repo] findAll failed');
      throw new AppError('Failed to fetch destinations', 500, 'DB_QUERY_ERROR');
    }

    return { data: data ?? [], count: count ?? 0 };
  },

  /**
   * Find a single destination by its URL slug.
   * Throws 404 if not found.
   */
  async findBySlug(slug: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      logger.warn({ slug, error }, '[destinations.repo] Destination not found');
      throw new AppError(`Destination "${slug}" not found`, 404, 'DESTINATION_NOT_FOUND');
    }

    return data;
  },

  /**
   * Update the AI-generated story for a destination.
   */
  async updateAiStory(id: string, story: string) {
    const { error } = await supabase
      .from('destinations')
      .update({
        ai_story: story,
        ai_story_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      logger.error({ error, id }, '[destinations.repo] Failed to update AI story');
      throw new AppError('Failed to update AI story', 500, 'DB_UPDATE_ERROR');
    }
  },

  /**
   * Find related destinations in the same region, excluding the current one.
   */
  async findRelated(destinationId: string, region: string, limit = 4) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('region', region)
      .neq('id', destinationId)
      .limit(limit);

    if (error) {
      logger.error({ error }, '[destinations.repo] findRelated failed');
      return [];
    }

    return data ?? [];
  },
};

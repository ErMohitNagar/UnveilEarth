import { supabase } from '../../db/supabaseClient.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { ListEventsQuery } from './events.schema.js';

export const eventsRepository = {
  async findAll(filters: ListEventsQuery) {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' });

    if (filters.destinationId) {
      query = query.eq('destination_id', filters.destinationId);
    }

    if (filters.startDate) {
      query = query.gte('start_date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('end_date', filters.endDate);
    }

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    query = query.order('start_date', { ascending: true }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error({ error }, '[events.repo] findAll failed');
      throw new AppError('Failed to fetch events', 500, 'DB_QUERY_ERROR');
    }

    return { data: data ?? [], count: count ?? 0 };
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    return data;
  },
};

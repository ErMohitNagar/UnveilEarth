import { getVectorClient } from '../../db/pool.js';
import pgvector from 'pgvector/pg';
import { CONSTANTS } from '../../config/constants.js';
import logger from '../../utils/logger.js';
import type { VectorSearchOptions, VectorSearchResult } from './vectorSearch.types.js';

export type { VectorSearchOptions, VectorSearchResult } from './vectorSearch.types.js';

export const vectorSearchService = {
  /**
   * Search for similar vectors using pgvector cosine similarity.
   *
   * Builds a parameterized query: SELECT columns, 1 - (embedding <=> $1) AS similarity
   * with optional WHERE filters, ordered by similarity DESC.
   */
  async searchSimilar(options: VectorSearchOptions): Promise<VectorSearchResult[]> {
    const {
      table,
      queryEmbedding,
      limit = CONSTANTS.VECTOR_SEARCH.DEFAULT_LIMIT,
      minSimilarity = CONSTANTS.VECTOR_SEARCH.MIN_SIMILARITY,
      filters = {},
      selectColumns = ['id'],
    } = options;

    const client = await getVectorClient();

    try {
      const embeddingSql = pgvector.toSql(queryEmbedding);

      // Build column list — always include the similarity computation
      const columns = [
        ...selectColumns,
        `1 - (embedding <=> $1) AS similarity`,
      ].join(', ');

      // Build WHERE clauses from filters
      const whereConditions: string[] = [`1 - (embedding <=> $1) >= $2`];
      const params: unknown[] = [embeddingSql, minSimilarity];
      let paramIndex = 3;

      for (const [column, value] of Object.entries(filters)) {
        // Sanitize column name — allow only alphanumeric and underscores
        const safeColumn = column.replace(/[^a-zA-Z0-9_]/g, '');
        whereConditions.push(`${safeColumn} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      const query = `
        SELECT ${columns}
        FROM ${table}
        ${whereClause}
        ORDER BY similarity DESC
        LIMIT $${paramIndex}
      `;
      params.push(limit);

      logger.debug(
        { table, limit, minSimilarity, filterCount: Object.keys(filters).length },
        '[vectorSearch] Executing similarity search',
      );

      const result = await client.query(query, params);

      logger.debug(
        { table, resultCount: result.rows.length },
        '[vectorSearch] Search completed',
      );

      return result.rows as VectorSearchResult[];
    } catch (error) {
      logger.error(
        { error: (error as Error).message, table },
        '[vectorSearch] Similarity search failed',
      );
      throw error;
    } finally {
      client.release();
    }
  },
};

import { destinationsRepository } from './destinations.repository.js';
import { genaiClient } from '../../services/genai/genai.client.js';
import { vectorSearchService } from '../../services/vectorSearch/vectorSearch.service.js';
import { cacheService } from '../../services/cache/cache.service.js';
import { buildStorytellingPrompt } from '../../services/genai/prompts/storytelling.prompt.js';
import { CONSTANTS } from '../../config/constants.js';
import logger from '../../utils/logger.js';
import type { Destination, DestinationDetail, DestinationFilters, PaginatedResult } from './destinations.types.js';

/**
 * Maps a snake_case database row to a camelCase Destination object.
 */
function mapDestination(row: Record<string, unknown>): Destination {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string) ?? '',
    region: (row.region as string) ?? '',
    country: (row.country as string) ?? '',
    category: (row.category as string) ?? '',
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    imageUrl: (row.image_url as string) ?? null,
    altText: (row.alt_text as string) ?? null,
    highlights: (row.highlights as string[]) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const destinationsService = {
  /**
   * List destinations with filters and pagination.
   */
  async list(filters: DestinationFilters): Promise<PaginatedResult<Destination>> {
    const { data, count } = await destinationsRepository.findAll(filters);

    return {
      data: data.map(mapDestination),
      total: count,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(count / filters.limit),
    };
  },

  /**
   * Get a destination by slug with AI-generated cultural storytelling.
   * Generates and caches the AI story if not present or stale.
   */
  async getBySlug(slug: string): Promise<DestinationDetail> {
    const row = await destinationsRepository.findBySlug(slug);
    const destination = mapDestination(row);

    // Check if we already have a fresh AI story (less than 24h old)
    const storyAge = row.ai_story_generated_at
      ? Date.now() - new Date(row.ai_story_generated_at as string).getTime()
      : Infinity;
    const isFresh = storyAge < CONSTANTS.CACHE_TTL.AI_STORY * 1000;

    let aiStory = (row.ai_story as string) ?? null;

    if (!aiStory || !isFresh) {
      const cacheKey = cacheService.generateKey('ai', 'story', slug);

      aiStory = await cacheService.getOrSet(
        cacheKey,
        async () => {
          logger.info({ slug }, '[destinations] Generating AI story');

          // Get RAG context via vector search for grounding
          let ragContext = '';
          try {
            const queryEmbedding = await genaiClient.generateEmbedding(
              `${destination.name} ${destination.region} cultural heritage traditions`,
            );
            const similarResults = await vectorSearchService.searchSimilar({
              table: 'destinations',
              queryEmbedding,
              limit: 5,
              minSimilarity: CONSTANTS.VECTOR_SEARCH.MIN_SIMILARITY,
              selectColumns: ['name', 'description', 'region', 'highlights'],
            });
            ragContext = similarResults
              .map((r) => `${r.name}: ${r.description}`)
              .join('\n');
          } catch (err) {
            logger.warn({ err }, '[destinations] RAG context retrieval failed, proceeding without');
          }

          // Build prompt and generate story
          const prompt = buildStorytellingPrompt(
            {
              name: destination.name,
              region: destination.region,
              country: destination.country,
              description: destination.description,
              highlights: destination.highlights ?? [],
            },
            ragContext || undefined,
          );

          const story = await genaiClient.generateContent(prompt, {
            temperature: 0.8,
            maxTokens: CONSTANTS.GENAI.MAX_CONTENT_TOKENS,
          });

          // Persist to DB asynchronously (don't block response)
          destinationsRepository.updateAiStory(destination.id, story).catch((err) => {
            logger.error({ err, id: destination.id }, '[destinations] Failed to persist AI story');
          });

          return story;
        },
        CONSTANTS.CACHE_TTL.AI_STORY,
      );
    }

    // Get related destinations
    const relatedRows = await destinationsRepository.findRelated(
      destination.id,
      destination.region,
    );

    return {
      ...destination,
      aiStory: aiStory,
      aiStoryGeneratedAt: (row.ai_story_generated_at as string) ?? null,
      relatedDestinations: relatedRows.map(mapDestination),
    };
  },
};

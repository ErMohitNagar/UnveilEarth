import { genaiClient } from '../../services/genai/genai.client.js';
import { vectorSearchService } from '../../services/vectorSearch/vectorSearch.service.js';
import { cacheService } from '../../services/cache/cache.service.js';
import { moderationService } from '../../services/moderation/contentModeration.service.js';
import { buildRecommendationPrompt } from '../../services/genai/prompts/recommendation.prompt.js';
import { buildHiddenGemsPrompt } from '../../services/genai/prompts/hiddenGems.prompt.js';
import { CONSTANTS } from '../../config/constants.js';
import { AppError } from '../../utils/apiResponse.js';
import logger from '../../utils/logger.js';
import type { RecommendationRequest, HiddenGemRequest, RecommendationResult, HiddenGemResult } from './discovery.types.js';

export const discoveryService = {
  /**
   * Get AI-personalized destination recommendations based on user preferences.
   * Biases toward hidden gems and heritage sites over mainstream destinations.
   */
  async getRecommendations(input: RecommendationRequest): Promise<RecommendationResult[]> {
    // Sanitize user inputs before interpolating into prompts
    const sanitizedInterests = input.interests.map((i) => moderationService.sanitizeForPrompt(i));

    // Build cache key from preferences
    const cacheKey = cacheService.generateKey(
      'ai',
      'recommendations',
      sanitizedInterests.sort().join(','),
      input.budget,
      input.travelStyle,
      ...(input.preferredRegions?.sort() ?? []),
    );

    return cacheService.getOrSet(
      cacheKey,
      async () => {
        logger.info({ input }, '[discovery] Generating AI recommendations');

        const prompt = buildRecommendationPrompt(
          {
            interests: sanitizedInterests,
            budget: input.budget,
            travelStyle: input.travelStyle,
            regions: input.preferredRegions,
          },
        );

        const rawResponse = await genaiClient.generateContent(prompt, {
          temperature: 0.7,
          maxTokens: CONSTANTS.GENAI.MAX_CONTENT_TOKENS,
          systemInstruction:
            'You are an expert travel advisor specializing in hidden cultural gems. Always respond with valid JSON.',
        });

        // Parse JSON response from AI
        try {
          const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
          if (!jsonMatch) {
            throw new Error('No JSON array found in AI response');
          }
          const recommendations = JSON.parse(jsonMatch[0]) as RecommendationResult[];
          return recommendations.slice(0, 10);
        } catch (err) {
          logger.error({ err, rawResponse: rawResponse.slice(0, 500) }, '[discovery] Failed to parse AI recommendations');
          throw new AppError('Failed to generate recommendations', 500, 'AI_PARSE_ERROR');
        }
      },
      CONSTANTS.CACHE_TTL.AI_RECOMMENDATION,
    );
  },

  /**
   * RAG-powered hidden gem search.
   * Generates embedding for the query → searches pgvector for similar destinations
   * → feeds results into Gemini for synthesis → returns grounded recommendations.
   */
  async findHiddenGems(input: HiddenGemRequest): Promise<HiddenGemResult[]> {
    const sanitizedQuery = moderationService.sanitizeForPrompt(input.query);

    if (!moderationService.isContentSafe(sanitizedQuery)) {
      throw new AppError('Query contains inappropriate content', 400, 'CONTENT_UNSAFE');
    }

    logger.info({ query: sanitizedQuery }, '[discovery] Searching for hidden gems via RAG');

    // Step 1: Generate embedding for the search query
    const queryEmbedding = await genaiClient.generateEmbedding(sanitizedQuery);

    // Step 2: Vector similarity search
    const filters: Record<string, unknown> = {};
    if (input.region) filters.region = input.region;
    if (input.category) filters.category = input.category;

    const similarResults = await vectorSearchService.searchSimilar({
      table: 'destinations',
      queryEmbedding,
      limit: input.limit ?? CONSTANTS.VECTOR_SEARCH.DEFAULT_LIMIT,
      minSimilarity: CONSTANTS.VECTOR_SEARCH.MIN_SIMILARITY,
      filters,
      selectColumns: ['id', 'name', 'description', 'region', 'category', 'slug'],
    });

    if (similarResults.length === 0) {
      return [];
    }

    // Step 3: Feed RAG context into Gemini for synthesis
    const prompt = buildHiddenGemsPrompt(
      sanitizedQuery,
      similarResults.map((r) => ({
        name: r.name as string,
        description: r.description as string,
        similarity: r.similarity,
      })),
    );

    const aiSynthesis = await genaiClient.generateContent(prompt, {
      temperature: 0.6,
      maxTokens: CONSTANTS.GENAI.MAX_CONTENT_TOKENS,
    });

    // Step 4: Combine vector results with AI summaries
    return similarResults.map((result) => ({
      id: result.id,
      name: result.name as string,
      description: (result.description as string) ?? '',
      region: (result.region as string) ?? '',
      similarity: result.similarity,
      aiSummary: aiSynthesis, // Full synthesis applied to all results
    }));
  },
};

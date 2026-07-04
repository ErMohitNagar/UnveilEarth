/** App-wide constants — no magic numbers scattered across the codebase */
export const CONSTANTS = {
  /** Pagination defaults */
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  /** Cache TTL values (in seconds) */
  CACHE_TTL: {
    /** Default TTL for general cache entries: 10 minutes */
    DEFAULT: 60 * 10,
    /** AI-generated storytelling content: 24 hours */
    AI_STORY: 60 * 60 * 24,
    /** AI recommendations: 1 hour */
    AI_RECOMMENDATION: 60 * 60,
    /** Destination list: 15 minutes */
    DESTINATION_LIST: 60 * 15,
    /** Event list: 10 minutes */
    EVENT_LIST: 60 * 10,
    /** Experience detail: 30 minutes */
    EXPERIENCE_DETAIL: 60 * 30,
  },

  /** Rate limit windows (in milliseconds) */
  RATE_LIMIT: {
    /** Global: 100 requests per 15 minutes */
    GLOBAL: { windowMs: 15 * 60 * 1000, max: 100 },
    /** AI endpoints: 20 requests per 15 minutes */
    AI: { windowMs: 15 * 60 * 1000, max: 20 },
    /** Auth endpoints: 50 requests per 15 minutes */
    AUTH: { windowMs: 15 * 60 * 1000, max: 50 },
  },

  /** GenAI configuration */
  GENAI: {
    /** Gemini model for content generation */
    GEMINI_MODEL: 'gemini-2.0-flash',
    /** Gemini model for embeddings */
    EMBEDDING_MODEL: 'gemini-embedding-001',
    /** Embedding vector dimensions */
    EMBEDDING_DIMENSIONS: 768,
    /** Groq model for chat */
    GROQ_CHAT_MODEL: 'llama-3.3-70b-versatile',
    /** Max tokens for content generation */
    MAX_CONTENT_TOKENS: 2048,
    /** Max tokens for chat responses */
    MAX_CHAT_TOKENS: 1024,
    /** Max retry attempts for AI calls */
    MAX_RETRIES: 2,
    /** Base delay for exponential backoff (ms) */
    RETRY_BASE_DELAY: 1000,
  },

  /** Vector search defaults */
  VECTOR_SEARCH: {
    /** Minimum cosine similarity threshold */
    MIN_SIMILARITY: 0.65,
    /** Default result limit */
    DEFAULT_LIMIT: 10,
    /** Maximum results to return */
    MAX_LIMIT: 50,
  },

  /** User roles */
  ROLES: {
    TRAVELER: 'traveler',
    GUIDE: 'guide',
    ADMIN: 'admin',
  } as const,
} as const;

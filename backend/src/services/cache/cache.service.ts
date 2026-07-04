import NodeCache from 'node-cache';
import { CONSTANTS } from '../../config/constants.js';
import logger from '../../utils/logger.js';

const cache = new NodeCache({
  stdTTL: CONSTANTS.CACHE_TTL.DEFAULT,
  checkperiod: 120,
  useClones: false, // Avoid deep cloning for performance; callers must not mutate cached values
});

cache.on('expired', (key: string) => {
  logger.debug({ key }, '[cache] Key expired');
});

export const cacheService = {
  /**
   * Get a value from cache by key.
   */
  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  },

  /**
   * Set a value in cache with optional TTL override.
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl !== undefined) {
      return cache.set(key, value, ttl);
    }
    return cache.set(key, value);
  },

  /**
   * Delete one or more keys from cache.
   */
  del(key: string | string[]): number {
    return cache.del(key);
  },

  /**
   * Flush the entire cache.
   */
  flush(): void {
    cache.flushAll();
    logger.info('[cache] Cache flushed');
  },

  /**
   * Cache-aside pattern: return cached value if present, otherwise call fetcher,
   * cache the result, and return it.
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== undefined) {
      logger.debug({ key }, '[cache] Cache hit');
      return cached;
    }

    logger.debug({ key }, '[cache] Cache miss, fetching');
    const value = await fetcher();

    if (ttl !== undefined) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }

    return value;
  },

  /**
   * Generate a consistent cache key from parts, joined by colons.
   * Example: generateKey('destination', 'story', '123') => 'destination:story:123'
   */
  generateKey(...parts: string[]): string {
    return parts.join(':');
  },

  /**
   * Get cache statistics for monitoring.
   */
  getStats() {
    return cache.getStats();
  },
};

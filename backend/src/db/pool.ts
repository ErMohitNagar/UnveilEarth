import pg from 'pg';
import pgvector from 'pgvector/pg';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

const { Pool } = pg;

/**
 * Raw PostgreSQL connection pool for pgvector queries.
 * The Supabase JS client doesn't natively support vector operations,
 * so we use the pg driver directly for cosine similarity searches.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PostgreSQL pool error');
});

/**
 * Get a client from the pool with pgvector types registered.
 * Always release the client back to the pool after use.
 *
 * Usage:
 *   const client = await getVectorClient();
 *   try { ... } finally { client.release(); }
 */
export async function getVectorClient(): Promise<pg.PoolClient> {
  const client = await pool.connect();
  await pgvector.registerTypes(client);
  return client;
}

/**
 * Gracefully close the pool (for shutdown hooks).
 */
export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('PostgreSQL pool closed');
}

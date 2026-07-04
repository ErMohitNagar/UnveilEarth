import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Zod schema for all required environment variables.
 * Application fails fast at startup if any required var is missing or malformed.
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),

  // Database (direct Postgres for pgvector)
  DATABASE_URL: z.string().min(1),

  // GenAI Providers
  GEMINI_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),

  // Optional
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const formatted = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${(msgs ?? []).join(', ')}`)
      .join('\n');

    console.error('❌ Invalid environment variables:\n' + formatted);
    process.exit(1);
  }

  return parsed.data;
}

/** Validated, typed environment variables — safe to use throughout the app */
export const env = loadEnv();

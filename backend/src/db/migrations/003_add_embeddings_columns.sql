-- ============================================================
-- Add embedding columns and HNSW indexes for vector search
-- Uses gemini-embedding-001 with 768 dimensions
-- ============================================================

-- Add embedding column to destinations
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Add embedding column to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Add embedding column to experiences
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS embedding vector(768);

-- ─── HNSW Indexes for Cosine Similarity ──────────────
-- HNSW provides better recall and query performance than IVFFlat
-- for most workloads, especially at smaller scales.

CREATE INDEX IF NOT EXISTS idx_destinations_embedding
  ON destinations USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_events_embedding
  ON events USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_experiences_embedding
  ON experiences USING hnsw (embedding vector_cosine_ops);

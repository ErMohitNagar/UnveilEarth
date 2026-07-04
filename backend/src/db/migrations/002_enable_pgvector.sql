-- ============================================================
-- Enable pgvector extension for vector similarity search
-- ============================================================
-- This must be run by a user with superuser or extension-creation privileges.
-- In Supabase, this is available through the Dashboard > Database > Extensions.

CREATE EXTENSION IF NOT EXISTS vector;

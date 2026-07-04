export interface VectorSearchOptions {
  table: string;
  queryEmbedding: number[];
  limit?: number;
  minSimilarity?: number;
  filters?: Record<string, unknown>;
  selectColumns?: string[];
}

export interface VectorSearchResult {
  id: string;
  similarity: number;
  [key: string]: unknown;
}

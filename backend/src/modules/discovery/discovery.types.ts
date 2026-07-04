export interface RecommendationRequest {
  interests: string[];
  budget: 'budget' | 'moderate' | 'luxury';
  travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'culinary' | 'eco';
  preferredRegions?: string[];
  excludeSlugs?: string[];
}

export interface HiddenGemRequest {
  query: string;
  region?: string;
  category?: string;
  limit?: number;
}

export interface RecommendationResult {
  name: string;
  slug: string;
  reason: string;
  matchScore: number;
  category: string;
}

export interface HiddenGemResult {
  id: string;
  name: string;
  description: string;
  region: string;
  similarity: number;
  aiSummary: string;
}

import { DiscoveryFilters } from "@/features/discovery/components/DiscoveryFilters";
import { RecommendationFeed } from "@/features/discovery/components/RecommendationFeed";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12 max-w-screen-2xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight mb-3">
          Discover your next journey
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Use our AI to find destinations that perfectly match your travel style, 
          uncovering hidden gems and authentic cultural experiences.
        </p>
      </div>

      <DiscoveryFilters />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold font-outfit mb-6">Recommended for you</h2>
        <RecommendationFeed />
      </div>
    </div>
  );
}

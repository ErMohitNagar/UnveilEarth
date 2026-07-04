import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Sparkles } from "lucide-react";

export function DiscoveryFilters() {
  return (
    <div className="bg-card border rounded-2xl p-4 md:p-6 shadow-sm mb-8 sticky top-20 z-40">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Where do you want to go? Or what's your vibe?" 
            className="pl-10 h-12 text-base rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Button variant="outline" className="h-12 rounded-xl whitespace-nowrap bg-background">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            Region
          </Button>
          <Button variant="outline" className="h-12 rounded-xl whitespace-nowrap bg-background">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            Month
          </Button>
          <Button className="h-12 rounded-xl whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white">
            <Sparkles className="h-4 w-4 mr-2 text-indigo-200" />
            AI Suggest
          </Button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2 self-center">Trending vibes:</span>
        {["Ancient Ruins", "Culinary Journey", "Hidden Beaches", "Mountain Retreat", "Art & Architecture"].map((vibe) => (
          <Button key={vibe} variant="secondary" size="sm" className="rounded-full text-xs h-7">
            {vibe}
          </Button>
        ))}
      </div>
    </div>
  );
}

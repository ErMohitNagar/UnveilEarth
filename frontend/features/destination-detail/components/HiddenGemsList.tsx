"use client";

import { MapPin, Sparkles } from "lucide-react";
import { AiContentTag } from "@/components/shared/AiContentTag";
import { Card, CardContent } from "@/components/ui/card";
import { useHiddenGems } from "@/features/discovery/hooks/useHiddenGems";
import { Skeleton } from "@/components/ui/skeleton";

export function HiddenGemsList({ destinationName }: { destinationName: string }) {
  const { data: gems, isLoading } = useHiddenGems({ query: destinationName });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-outfit">Hidden Gems</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!gems || gems.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-outfit">Hidden Gems</h3>
        <AiContentTag />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gems.map((gem, idx) => (
          <Card key={idx} className="bg-muted/30 border-none hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-xs font-medium text-primary mb-3">
                <Sparkles className="h-3 w-3" />
                <span>Hidden Gem</span>
              </div>
              <h4 className="text-lg font-bold font-outfit mb-2">{gem.name}</h4>
              <p className="text-sm text-muted-foreground">{gem.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

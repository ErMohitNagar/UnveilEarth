"use client";

import { DestinationCard } from "./DestinationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestinations } from "../hooks/useDestinations";
import { Destination } from "@/types/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { Compass } from "lucide-react";

export function RecommendationFeed() {
  const { data: destinations, isLoading, error } = useDestinations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-2xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="pt-4 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load destinations. Please try again.
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No destinations found"
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {destinations.map((dest: Destination) => (
        <DestinationCard key={dest.id} destination={dest as any} />
      ))}
    </div>
  );
}

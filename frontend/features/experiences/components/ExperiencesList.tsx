"use client";

import { useExperiences } from "../hooks/useExperiences";
import { ExperienceCard } from "./ExperienceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Compass } from "lucide-react";

export function ExperiencesList() {
  const { data: experiences, isLoading, error } = useExperiences();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load experiences. Please try again.
      </div>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No experiences found"
        description="Check back later for new local experiences."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}

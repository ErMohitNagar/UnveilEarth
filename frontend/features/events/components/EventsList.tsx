"use client";

import { useEvents } from "../hooks/useEvents";
import { EventCard } from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar } from "lucide-react";

export function EventsList() {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-4 w-[100px] mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load events. Please try again.
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No local events found"
        description="Check back later for upcoming festivals, markets, and cultural events."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

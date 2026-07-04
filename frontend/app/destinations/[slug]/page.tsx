"use client";

import { useDestinationDetail } from "@/features/destination-detail/hooks/useDestinationDetail";
import { StorytellingPanel } from "@/features/destination-detail/components/StorytellingPanel";
import { HiddenGemsList } from "@/features/destination-detail/components/HiddenGemsList";
import { DestinationMap } from "@/features/destination-detail/components/DestinationMap";
import { MapPin, Calendar, Users, Camera, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { use } from "react";

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: destination, isLoading, error } = useDestinationDetail(resolvedParams.slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[60vh] w-full rounded-none" />
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-[250px] w-full rounded-2xl" />
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <EmptyState 
          icon={Compass} 
          title="Destination not found" 
          description="We couldn't find the destination you're looking for." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        {destination.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${destination.imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-12">
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
              {destination.category}
            </Badge>
            {destination.highlights?.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-outfit text-white mb-2 tracking-tight">
            {destination.name}
          </h1>
          <div className="flex items-center text-white/80 text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{destination.country}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            <StorytellingPanel 
              title={`The Story of ${destination.name}`}
              teaserText={destination.description}
              fullStoryText={destination.aiStory || "This destination's story is still being written."}
            />
            
            <HiddenGemsList destinationName={destination.name} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold font-outfit text-xl mb-4">Trip Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Region</p>
                    <p className="text-sm text-muted-foreground">{destination.region}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Category</p>
                    <p className="text-sm text-muted-foreground">{destination.category}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {(destination.longitude && destination.latitude) && (
              <div className="space-y-4">
                <h3 className="font-bold font-outfit text-xl">Location</h3>
                <DestinationMap longitude={destination.longitude} latitude={destination.latitude} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

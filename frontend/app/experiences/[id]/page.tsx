"use client";

import { useExperienceDetail } from "@/features/experiences/hooks/useExperiences";
import { BookingForm } from "@/features/experiences/components/BookingForm";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Compass, Clock, Users, MapPin, DollarSign } from "lucide-react";
import { use } from "react";
import { AiContentTag } from "@/components/shared/AiContentTag";

export default function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: experience, isLoading, error } = useExperienceDetail(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[50vh] w-full rounded-none" />
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <EmptyState 
          icon={Compass} 
          title="Experience not found" 
          description="We couldn't find the experience you're looking for." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-muted">
        {experience.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${experience.imageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">{experience.title}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {experience.durationHours && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>{experience.durationHours} hours</span>
                  </div>
                )}
                {experience.maxParticipants && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span>Up to {experience.maxParticipants} people</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold font-outfit mb-4">About this experience</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {experience.description}
                </p>
              </div>
            </div>
            
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                 <Users className="h-6 w-6 text-primary" />
               </div>
               <div>
                 <h3 className="font-bold text-lg">Hosted by a Local Guide</h3>
                 <p className="text-sm text-muted-foreground mt-1">This experience is hosted by a verified local artisan or guide, deeply connected to the culture and history of the area.</p>
               </div>
            </div>
          </div>
          
          {/* Booking Sidebar */}
          <div className="lg:col-start-3">
            <div className="sticky top-24">
              <BookingForm experience={experience} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

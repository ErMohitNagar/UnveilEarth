import { Experience } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, DollarSign } from "lucide-react";
import Link from "next/link";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link href={`/experiences/${experience.id}`} className="group h-full block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col border bg-card">
        <div className="relative h-48 w-full bg-muted">
          {experience.imageUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: `url(${experience.imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold font-outfit mb-2 line-clamp-2">{experience.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{experience.description}</p>
          
          <div className="flex flex-col gap-2 mt-auto text-sm text-muted-foreground">
            {experience.durationHours && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{experience.durationHours} hours</span>
              </div>
            )}
            
            {experience.maxParticipants && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Max {experience.maxParticipants} people</span>
              </div>
            )}
            
            {experience.priceCents !== null && (
              <div className="flex items-center font-medium text-foreground mt-2 border-t pt-2">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{(experience.priceCents / 100).toFixed(2)} {experience.currency}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

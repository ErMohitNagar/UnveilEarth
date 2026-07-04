import { Event } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function EventCard({ event }: { event: Event }) {
  const formattedDate = event.startDate 
    ? format(new Date(event.startDate), "MMM d, yyyy") 
    : "Ongoing";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col border bg-card">
      <div className="relative h-48 w-full bg-muted">
        {event.imageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs font-medium text-primary mb-2 gap-2">
          <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-outfit mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">{event.description}</p>
        
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground mt-auto">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

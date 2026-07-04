import Link from "next/link";
import { AiContentTag } from "@/components/shared/AiContentTag";
import { Badge } from "@/components/ui/badge";
import { Destination } from "@/types/api";

export function DestinationCard({ destination }: { destination: Destination }) {
  const tags = destination.highlights || [];
  
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl bg-card border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {destination.imageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${destination.imageUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <AiContentTag />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold font-outfit text-white mb-1">
              {destination.name}, <span className="text-white/80 font-normal">{destination.country}</span>
            </h3>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
            {destination.description}
          </p>
          
          <div className="space-y-3 mt-auto">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {destination.category}
              </Badge>
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="h-4 w-4 fill-current" />;
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className="h-4 w-4 fill-current" />;
          }
          return <Star key={i} className="h-4 w-4 text-neutral-300 dark:text-neutral-700" />;
        })}
      </div>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}

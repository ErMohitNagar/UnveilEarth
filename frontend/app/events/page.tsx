import { EventsList } from "@/features/events/components/EventsList";

export const metadata = {
  title: "Local Events | UnveilEarth",
  description: "Discover local festivals, cultural events, and markets around the world.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-foreground tracking-tight">
            Local Events & Festivals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Immerse yourself in authentic cultural celebrations, seasonal markets, and traditional ceremonies happening around the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <EventsList />
      </div>
    </div>
  );
}

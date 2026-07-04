import { ExperiencesList } from "@/features/experiences/components/ExperiencesList";

export const metadata = {
  title: "Local Experiences | UnveilEarth",
  description: "Book unique, guided experiences hosted by locals around the world.",
};

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-foreground tracking-tight">
            Local Experiences
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Go beyond the surface with authentic activities, private tours, and deep cultural immersions led by verified local guides.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <ExperiencesList />
      </div>
    </div>
  );
}

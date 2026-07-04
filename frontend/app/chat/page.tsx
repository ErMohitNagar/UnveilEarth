import { ChatWindow } from "@/features/chat/components/ChatWindow";

export const metadata = {
  title: "AI Travel Assistant | UnveilEarth",
  description: "Chat with our AI to discover hidden gems and plan your perfect trip.",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-foreground tracking-tight">
            Travel Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Ask for personalized recommendations, historical context, or custom itineraries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">
        <ChatWindow />
      </div>
    </div>
  );
}

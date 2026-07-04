"use client";

import { useAuth } from "@/providers/AuthProvider";
import { User, Compass, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 max-w-4xl animate-pulse">
        <div className="h-32 bg-muted rounded-2xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold font-outfit mb-4">Not Logged In</h1>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-outfit">{user.user_metadata?.name || user.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Compass className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold font-outfit">Saved Destinations</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            You haven&apos;t saved any destinations yet. Explore the world and save your favorites here.
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold font-outfit">My Bookings</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            No upcoming experiences booked. Start discovering local events and experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

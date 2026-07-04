"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Compass, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-outfit text-xl tracking-tight">
              UnveilEarth
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/discover"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Discover
            </Link>
            <Link
              href="/experiences"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Experiences
            </Link>
            <Link
              href="/events"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Local Events
            </Link>
          </nav>
        </div>
        
        {/* Mobile Nav toggle placeholder */}
        <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 h-9 w-9 md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <Link href="/" className="flex md:hidden items-center space-x-2 mr-auto">
          <Compass className="h-5 w-5 text-primary" />
          <span className="font-bold font-outfit text-lg tracking-tight">
            UnveilEarth
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search Placeholder */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {!isLoading && !user && (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 px-2 py-1"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
            {!isLoading && user && (
              <div className="flex items-center space-x-1 ml-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground/80"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground/80"
                  title="Log out"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

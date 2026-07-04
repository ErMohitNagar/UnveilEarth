"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Sparkles, Map, Compass } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDestinations } from "@/features/discovery/hooks/useDestinations";
import { DestinationCard } from "@/features/discovery/components/DestinationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Destination } from "@/types/api";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { data: trendingDestinations, isLoading } = useDestinations({ limit: 3 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        ref={containerRef}
        className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black"
      >
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          {/* We would use next/image here in reality, but standard img is easier to mock an unsplash image for now */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 mb-6 border border-white/20 text-white text-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>GenAI-powered destination discovery</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold font-outfit text-white tracking-tight mb-6 max-w-5xl mx-auto leading-tight">
              Peel back the surface of every place you visit.
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
              Go beyond the tourist traps. UnveilEarth uses AI to craft authentic, 
              immersive cultural experiences tailored to your curiosity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/discover" 
                className={cn(buttonVariants({ size: "lg" }), "rounded-full h-14 px-8 text-base bg-white text-black hover:bg-neutral-200")}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/experiences" 
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full h-14 px-8 text-base bg-black/20 text-white border-white/30 backdrop-blur-md hover:bg-white/10")}
              >
                Find Local Guides
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Curated Discovery</h3>
              <p className="text-muted-foreground">Stop searching through endless generic blogs. Let AI uncover hidden gems matched to your unique travel style.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Cultural Immersion</h3>
              <p className="text-muted-foreground">Dive deep into local heritage, folklore, and traditions with rich storytelling dynamically generated for each location.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-outfit">Authentic Connections</h3>
              <p className="text-muted-foreground">Book experiences directly with verified local guides and artisans, ensuring your tourism dollars support the community.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations Teaser */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Trending right now</h2>
              <p className="text-muted-foreground text-lg">Where curious travelers are venturing this week.</p>
            </div>
            <Link 
              href="/discover" 
              className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex mt-4 md:mt-0")}
            >
              View all destinations <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : trendingDestinations ? (
              trendingDestinations.map((dest: Destination) => (
                <DestinationCard key={dest.id} destination={dest as any} />
              ))
            ) : null}
          </div>
          
          <Link 
            href="/discover" 
            className={cn(buttonVariants({ variant: "outline" }), "w-full mt-8 md:hidden")}
          >
            View all destinations
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AiContentTag } from "@/components/shared/AiContentTag";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StorytellingPanelProps {
  title: string;
  teaserText: string;
  fullStoryText: string;
}

export function StorytellingPanel({ title, teaserText, fullStoryText }: StorytellingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <AiContentTag className="mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold font-outfit text-foreground">{title}</h2>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full bg-muted/50" title="Listen to story">
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90 font-medium">
          {teaserText}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden mt-6"
            >
              <div className="pt-4 border-t border-border/50">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                  {fullStoryText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isExpanded && (
        <Button 
          onClick={() => setIsExpanded(true)}
          variant="outline" 
          className="mt-6 w-full md:w-auto rounded-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Read the full story
        </Button>
      )}
    </div>
  );
}

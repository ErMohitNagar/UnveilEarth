import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiContentTag({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      <span>AI-crafted</span>
    </div>
  );
}

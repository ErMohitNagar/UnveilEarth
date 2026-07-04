import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1 text-sm font-medium text-emerald-600 dark:text-emerald-400",
        className
      )}
      title="Verified Local Guide"
    >
      <CheckCircle2 className="h-4 w-4" />
      <span>Verified</span>
    </div>
  );
}

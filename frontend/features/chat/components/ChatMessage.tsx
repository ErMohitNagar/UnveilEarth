import { ChatMessageData } from "../api/chatApi";
import { User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-5 py-3.5 text-sm",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted rounded-tl-sm"
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

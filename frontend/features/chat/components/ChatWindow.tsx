"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export function ChatWindow({ destinationId }: { destinationId?: string }) {
  const { messages, isStreaming, error, sendMessage } = useChat(destinationId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-card border rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold font-outfit mb-2">Sign in to Chat</h3>
        <p className="text-muted-foreground mb-6">Create an account or log in to use the AI travel assistant.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-card border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-bold font-outfit">AI Travel Assistant</h3>
        <p className="text-xs text-muted-foreground">Powered by Groq & Gemini</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t bg-background flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about hidden gems, itineraries..."
          disabled={isStreaming}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || isStreaming} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

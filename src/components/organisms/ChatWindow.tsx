"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatBubble from "@/components/molecules/ChatBubble";
import Spinner from "@/components/atoms/Spinner";

interface Message {
  text: string;
  isUser: boolean;
  sources?: string[];
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
  embedded?: boolean;
}

export default function ChatWindow({
  messages,
  onSend,
  isLoading,
  embedded = false,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={
        embedded
          ? "flex h-full flex-col"
          : "flex h-[600px] flex-col rounded-lg border border-border"
      }
    >
      {!embedded && (
        <div className="border-b border-border bg-accent/50 px-4 py-3">
          <h3 className="font-medium">Chat with InsureMatch AI</h3>
          <p className="text-xs text-muted-foreground">
            Ask follow-up questions about your recommendations
          </p>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4"
      >
        <div className="space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Ask a question about your insurance recommendations...
            </p>
          )}
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              message={msg.text}
              isUser={msg.isUser}
              sources={msg.sources}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-border p-4 flex gap-2"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
        <Button type="submit" disabled={!input.trim() || isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}

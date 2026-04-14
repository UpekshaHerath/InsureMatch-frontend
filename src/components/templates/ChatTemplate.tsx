"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/organisms/ChatWindow";

interface Message {
  text: string;
  isUser: boolean;
  sources?: string[];
}

export default function ChatTemplate() {
  const { sessionId, buildUserProfile } = useProfileStore();
  const chat = useChat();
  const [messages, setMessages] = useState<Message[]>([]);

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Session</h1>
        <p className="text-muted-foreground mb-8">
          Get recommendations first to start a chat session.
        </p>
        <Link href="/profile">
          <Button>Start Profile</Button>
        </Link>
      </div>
    );
  }

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      const profile = buildUserProfile();
      const result = await chat.mutateAsync({
        session_id: sessionId,
        message,
        user_profile: profile,
      });
      setMessages((prev) => [
        ...prev,
        { text: result.response, isUser: false, sources: result.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            Follow-up Questions
          </h1>
          <p className="text-muted-foreground">
            Ask anything about your insurance recommendations
          </p>
        </div>
        <Link href="/results">
          <Button variant="outline">Back to Results</Button>
        </Link>
      </div>

      <ChatWindow
        messages={messages}
        onSend={handleSend}
        isLoading={chat.isPending}
      />
    </div>
  );
}

import { cn } from "@/lib/utils";

type Accent = "primary" | "purple";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  accent?: Accent;
}

export default function ChatBubble({
  message,
  isUser,
  accent = "primary",
}: ChatBubbleProps) {
  const userBubble =
    accent === "purple"
      ? "bg-purple-600 text-white rounded-br-md"
      : "bg-primary text-primary-foreground rounded-br-md";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 break-words",
          isUser ? userBubble : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

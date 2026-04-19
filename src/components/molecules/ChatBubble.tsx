import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  sources?: string[];
}

export default function ChatBubble({ message, isUser, sources }: ChatBubbleProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sources.map((src, i) => (
              <span
                key={i}
                className="inline-block rounded-full bg-background/50 px-2 py-0.5 text-xs"
              >
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

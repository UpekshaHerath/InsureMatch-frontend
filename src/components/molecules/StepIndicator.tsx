import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  state: "completed" | "active" | "pending";
  onClick?: () => void;
}

export default function StepIndicator({
  stepNumber,
  title,
  state,
  onClick,
}: StepIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
      disabled={state === "pending"}
      type="button"
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all",
          state === "completed" &&
            "bg-green-500 text-white",
          state === "active" &&
            "bg-primary text-primary-foreground ring-4 ring-primary/20",
          state === "pending" &&
            "bg-muted text-muted-foreground"
        )}
      >
        {state === "completed" ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          stepNumber
        )}
      </div>
      <span
        className={cn(
          "text-xs font-medium hidden sm:block",
          state === "active" && "text-primary",
          state === "completed" && "text-green-600",
          state === "pending" && "text-muted-foreground"
        )}
      >
        {title}
      </span>
    </button>
  );
}

import { cn } from "@/lib/utils";

interface ImpactIndicatorProps {
  direction: "positive" | "negative";
  score: number;
}

export default function ImpactIndicator({
  direction,
  score,
}: ImpactIndicatorProps) {
  const isPositive = direction === "positive";

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-500"
        )}
      >
        {isPositive ? "+" : "-"}
        {Math.abs(score).toFixed(2)}
      </span>
      <svg
        className={cn(
          "h-4 w-4",
          isPositive ? "text-green-600" : "text-red-500 rotate-180"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </div>
  );
}

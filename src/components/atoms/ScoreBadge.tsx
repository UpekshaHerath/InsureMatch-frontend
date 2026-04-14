import { Badge } from "@/components/ui/badge";
import { formatScore, getScoreBgColor } from "@/lib/utils/format";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`text-sm font-semibold px-3 py-1 ${getScoreBgColor(score)}`}
    >
      {formatScore(score)}%
    </Badge>
  );
}

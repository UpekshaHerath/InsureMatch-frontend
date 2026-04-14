import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/atoms/ScoreBadge";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";
import type { PolicyScore } from "@/lib/types/api";

interface PolicyCardProps {
  policy: PolicyScore;
  rank: number;
}

export default function PolicyCard({ policy, rank }: PolicyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {rank}
            </span>
            <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
          </div>
          {policy.company && (
            <p className="text-sm text-muted-foreground">{policy.company}</p>
          )}
        </div>
        <ScoreBadge score={policy.suitability_score} />
      </CardHeader>
      <CardContent>
        <Badge variant="outline">
          {POLICY_TYPE_LABELS[policy.policy_type] || policy.policy_type}
        </Badge>
      </CardContent>
    </Card>
  );
}

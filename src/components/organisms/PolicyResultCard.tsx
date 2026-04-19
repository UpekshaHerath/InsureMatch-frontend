import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/atoms/ScoreBadge";
import SHAPFactorRow from "@/components/molecules/SHAPFactorRow";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";
import type {
  PolicyScore,
  PolicyExplanation,
  RiderRecommendation,
} from "@/lib/types/api";

interface PolicyResultCardProps {
  policy: PolicyScore;
  explanation?: PolicyExplanation;
  rank: number;
  riderSuggestions?: RiderRecommendation[];
}

const PREMIUM_LABELS = ["Low", "Medium", "High"];

export default function PolicyResultCard({
  policy,
  explanation,
  rank,
  riderSuggestions,
}: PolicyResultCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-accent/50 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {rank}
            </span>
            <div>
              <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
              {policy.company && (
                <p className="text-sm text-muted-foreground">
                  {policy.company}
                </p>
              )}
            </div>
          </div>
          <ScoreBadge score={policy.suitability_score} />
        </div>
        <Badge variant="outline" className="w-fit mt-2">
          {POLICY_TYPE_LABELS[policy.policy_type] || policy.policy_type}
        </Badge>
      </CardHeader>

      {explanation && (
        <CardContent className="pt-4 space-y-4">
          {explanation.shap_summary && (
            <p className="text-sm text-muted-foreground">
              {explanation.shap_summary}
            </p>
          )}

          {explanation.positive_factors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2">
                Why this works for you
              </h4>
              <div className="space-y-2">
                {explanation.positive_factors.map((f, i) => (
                  <SHAPFactorRow key={i} factor={f} />
                ))}
              </div>
            </div>
          )}

          {explanation.negative_factors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-500 mb-2">
                Points to consider
              </h4>
              <div className="space-y-2">
                {explanation.negative_factors.map((f, i) => (
                  <SHAPFactorRow key={i} factor={f} />
                ))}
              </div>
            </div>
          )}

          {riderSuggestions && riderSuggestions.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-secondary mb-1">
                Suggested extra riders for you
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Add-on coverage that closes gaps for your profile.
              </p>
              <div className="space-y-3">
                {riderSuggestions.map((r) => (
                  <div
                    key={r.rider_code}
                    className="rounded-md border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-secondary text-sm">
                            {r.rider_name}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
                            {r.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        {r.description && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {r.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {PREMIUM_LABELS[r.premium_level] ?? "Medium"} premium
                      </span>
                    </div>
                    {r.reasons.length > 0 && (
                      <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                        {r.reasons.map((reason, i) => (
                          <li key={i}>• {reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

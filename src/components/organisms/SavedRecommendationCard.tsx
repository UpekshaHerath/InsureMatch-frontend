"use client";

import { Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PolicyMiniSummary from "@/components/molecules/PolicyMiniSummary";
import { UNION_POLICIES } from "@/lib/data/unionPolicies";
import type {
  PolicyScore,
  PolicyExplanation,
  RiderRecommendation,
  InbuiltRider,
} from "@/lib/types/api";

export interface SavedRecommendation {
  id: string;
  created_at: string;
  top_recommendation: string | null;
  ranked_policies: PolicyScore[] | null;
  explanations: PolicyExplanation[] | null;
  rider_suggestions: Record<string, RiderRecommendation[]> | null;
  session_id: string | null;
}

// Normalize a policy name for fuzzy matching:
// lowercase, strip parens, drop "union ", collapse whitespace.
function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop parens block
    .replace(/^union\s+/, " ") // drop "union " prefix
    .replace(/\s+/g, " ")
    .trim();
}

// Index UNION_POLICIES by every plausible alias of the canonical name.
const POLICY_INDEX: Map<string, (typeof UNION_POLICIES)[number]> = (() => {
  const m = new Map<string, (typeof UNION_POLICIES)[number]>();
  for (const p of UNION_POLICIES) {
    const aliases = new Set<string>([
      p.name,
      p.shortName ?? "",
      p.slug.replace(/-/g, " "),
      normalizeName(p.name),
      normalizeName(p.shortName ?? ""),
    ]);
    for (const a of aliases) {
      const k = a.trim().toLowerCase();
      if (k) m.set(k, p);
    }
  }
  return m;
})();

function inbuiltFor(policyName: string): InbuiltRider[] {
  const raw = policyName.trim().toLowerCase();
  const norm = normalizeName(policyName);

  let policy = POLICY_INDEX.get(raw) ?? POLICY_INDEX.get(norm);

  // Fallback: best fuzzy match — either index key contains the input,
  // or the input contains the index key (handles both directions).
  if (!policy) {
    for (const [key, p] of POLICY_INDEX) {
      if (key && (norm.includes(key) || key.includes(norm))) {
        policy = p;
        break;
      }
    }
  }

  if (!policy) return [];
  return policy.inbuiltRiders.map((r) => ({
    rider_name: r.name,
    rider_code: r.id,
    category: r.category,
    description: r.summary,
  }));
}

interface Props {
  rec: SavedRecommendation;
}

const DATE_FMT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export default function SavedRecommendationCard({ rec }: Props) {
  const top3 = (rec.ranked_policies ?? []).slice(0, 3);
  const explanationsByName = new Map(
    (rec.explanations ?? []).map((e) => [e.policy_name, e])
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-accent/40 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base text-slate-900">
              {new Date(rec.created_at).toLocaleString(undefined, DATE_FMT)}
            </CardTitle>
            {rec.top_recommendation && (
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">Top pick:</span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  {rec.top_recommendation}
                </Badge>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {top3.length} policies ranked
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {top3.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No structured policy data stored for this entry.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {top3.map((p) => (
              <PolicyMiniSummary
                key={p.policy_name}
                policy={p}
                explanation={explanationsByName.get(p.policy_name)}
                addOnRiders={rec.rider_suggestions?.[p.policy_name]}
                inbuiltRiders={inbuiltFor(p.policy_name)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/atoms/ScoreBadge";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";
import type {
  PolicyScore,
  PolicyExplanation,
  RiderRecommendation,
  InbuiltRider,
} from "@/lib/types/api";

interface Props {
  policy: PolicyScore;
  explanation?: PolicyExplanation;
  addOnRiders?: RiderRecommendation[];
  inbuiltRiders?: InbuiltRider[];
}

export default function PolicyMiniSummary({
  policy,
  explanation,
  addOnRiders,
  inbuiltRiders,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const summary =
    explanation?.shap_summary?.split(".")[0]?.trim() ||
    "AI-ranked policy match for this profile.";

  const addOnCount = addOnRiders?.length ?? 0;
  const inbuiltCount = inbuiltRiders?.length ?? 0;

  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {policy.rank}
            </span>
            <h4 className="truncate text-sm font-semibold text-slate-900">
              {policy.policy_name}
            </h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {POLICY_TYPE_LABELS[policy.policy_type] || policy.policy_type}
          </Badge>
        </div>
        <ScoreBadge score={policy.suitability_score} />
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-slate-600">{summary}.</p>

      {(addOnCount > 0 || inbuiltCount > 0) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="h-3 w-3" />
          {inbuiltCount} included · {addOnCount} add-on
          {addOnCount === 1 ? "" : "s"}
          {expanded ? (
            <ChevronUp className="ml-0.5 h-3 w-3" />
          ) : (
            <ChevronDown className="ml-0.5 h-3 w-3" />
          )}
        </button>
      )}

      {expanded && (
        <div className="mt-2 space-y-2">
          {inbuiltCount > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Included
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {inbuiltRiders!.map((r) => (
                  <span
                    key={r.rider_code}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 border border-emerald-200"
                  >
                    {r.rider_name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {addOnCount > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Recommended add-ons
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {addOnRiders!.map((r) => (
                  <span
                    key={r.rider_code}
                    className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-700 border border-orange-200"
                  >
                    {r.rider_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

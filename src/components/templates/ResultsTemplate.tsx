"use client";

import Link from "next/link";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { Button } from "@/components/ui/button";
import PolicyResultCard from "@/components/organisms/PolicyResultCard";
import NarrativePanel from "@/components/organisms/NarrativePanel";
import FloatingChat from "@/components/organisms/FloatingChat";

export default function ResultsTemplate() {
  const { recommendationResult } = useProfileStore();

  if (!recommendationResult) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Results Yet</h1>
        <p className="text-muted-foreground mb-8">
          Complete your profile to get personalized recommendations.
        </p>
        <Link href="/profile">
          <Button>Start Profile</Button>
        </Link>
      </div>
    );
  }

  const {
    ranked_policies,
    explanations,
    rag_narrative,
    top_recommendation,
    rider_suggestions,
    inbuilt_riders,
  } = recommendationResult;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">
          Your Recommendations
        </h1>
        <p className="text-muted-foreground">
          Based on your profile, here are the best insurance policies for you
        </p>
      </div>

      {top_recommendation && (
        <div className="mb-6 rounded-lg border border-primary/20 bg-accent p-4">
          <p className="text-sm font-medium text-primary">
            Top Pick: {top_recommendation}
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {ranked_policies.map((policy, i) => (
          <PolicyResultCard
            key={policy.policy_name}
            policy={policy}
            explanation={explanations.find(
              (e) => e.policy_name === policy.policy_name
            )}
            rank={i + 1}
            riderSuggestions={rider_suggestions?.[policy.policy_name]}
            inbuiltRiders={inbuilt_riders?.[policy.policy_name]}
          />
        ))}
      </div>

      <NarrativePanel narrative={rag_narrative} />

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>

      <FloatingChat />
    </div>
  );
}

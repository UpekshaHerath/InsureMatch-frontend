"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/atoms/Spinner";
import SavedRecommendationCard, {
  type SavedRecommendation,
} from "@/components/organisms/SavedRecommendationCard";

const SELECT =
  "id, top_recommendation, ranked_policies, explanations, rider_suggestions, created_at, session_id";

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [recs, setRecs] = useState<SavedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("recommendations")
      .select(SELECT)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) {
          setErr(error.message || "Failed to load recommendations.");
          setRecs([]);
        } else {
          setRecs((data as unknown as SavedRecommendation[]) || []);
          setErr(null);
        }
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">My Account</h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      <section aria-labelledby="past-recs-heading" className="space-y-4">
        <div>
          <h2
            id="past-recs-heading"
            className="text-xl font-semibold text-secondary"
          >
            Past recommendations
          </h2>
          <p className="text-sm text-muted-foreground">
            Your top 3 ranked policies and the riders we suggested for each one.
          </p>
        </div>

        {err && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Could not load recommendations.</p>
            <p className="mt-1 break-words font-mono text-xs">{err}</p>
            <p className="mt-2 text-xs text-red-700/80">
              If this mentions a missing column, apply migration{" "}
              <code>0003_inbuilt_riders.sql</code> in the Supabase SQL editor
              and retry.
            </p>
          </div>
        )}

        {recs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center space-y-4">
            <p className="text-muted-foreground">No recommendations yet.</p>
            <Link href="/profile">
              <Button>Get a recommendation</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recs.map((r) => (
              <SavedRecommendationCard key={r.id} rec={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

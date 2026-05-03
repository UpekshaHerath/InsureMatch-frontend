"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/lib/hooks/useAuth";
import { usePastRecommendations } from "@/lib/hooks/usePastRecommendations";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/atoms/Spinner";
import SavedRecommendationCard from "@/components/organisms/SavedRecommendationCard";

const PAGE_SIZE = 5;

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = usePastRecommendations(
    page,
    PAGE_SIZE,
    Boolean(user)
  );

  const recs = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showPager = total > PAGE_SIZE;
  const errMsg =
    error instanceof Error ? error.message : error ? String(error) : null;

  if (authLoading || (isLoading && !data)) {
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
        <div className="flex flex-wrap items-end justify-between gap-2">
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
          {data && (
            <p className="text-xs text-muted-foreground">
              {total === 0
                ? "0 saved"
                : `Showing ${recs.length} of ${total} (page ${page} of ${totalPages})`}
            </p>
          )}
        </div>

        {errMsg && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Could not load recommendations.</p>
            <p className="mt-1 break-words font-mono text-xs">{errMsg}</p>
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
          <div
            className={`space-y-4 ${isFetching ? "opacity-60 pointer-events-none" : ""}`}
            aria-busy={isFetching}
          >
            {recs.map((r) => (
              <SavedRecommendationCard key={r.id} rec={r} />
            ))}
          </div>
        )}

        {showPager && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page >= totalPages || isFetching}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

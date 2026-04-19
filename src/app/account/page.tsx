"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/atoms/Spinner";

interface RecRow {
  id: string;
  top_recommendation: string | null;
  rag_narrative: string | null;
  created_at: string;
  session_id: string | null;
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [recs, setRecs] = useState<RecRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("recommendations")
      .select("id, top_recommendation, rag_narrative, created_at, session_id")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRecs((data as RecRow[]) || []);
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
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">My Account</h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recs.length === 0 ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-muted-foreground">No recommendations yet.</p>
              <Link href="/profile">
                <Button>Get a recommendation</Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recs.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {r.top_recommendation || "Recommendation"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {r.rag_narrative && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {r.rag_narrative}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

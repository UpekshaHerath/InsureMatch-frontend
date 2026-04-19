"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import type { RiderMetadata } from "@/lib/types/api";

interface Props {
  riders: RiderMetadata[];
}

export default function RiderListTable({ riders }: Props) {
  const queryClient = useQueryClient();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  if (riders.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
        No riders indexed yet. Upload a riders document above.
      </div>
    );
  }

  async function handleDelete(code: string) {
    if (!confirm(`Delete rider "${code}"?`)) return;
    setDeletingCode(code);
    try {
      await apiClient.delete(`${ENDPOINTS.RIDERS}/${encodeURIComponent(code)}`);
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
    } catch {
      alert("Failed to delete rider.");
    } finally {
      setDeletingCode(null);
    }
  }

  async function handleClearAll() {
    if (!confirm("Wipe the entire rider catalog?")) return;
    try {
      await apiClient.delete(ENDPOINTS.RIDERS);
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
    } catch {
      alert("Failed to clear rider catalog.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="text-red-600 hover:text-red-700"
        >
          Clear all riders
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Rider</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Applies to</th>
              <th className="px-4 py-2 font-medium">Age</th>
              <th className="px-4 py-2 font-medium">Premium</th>
              <th className="px-4 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {riders.map((r) => (
              <tr key={r.rider_code} className="border-t border-border">
                <td className="px-4 py-2">
                  <div className="font-medium text-secondary">{r.rider_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.rider_code}
                    {r.company ? ` · ${r.company}` : ""}
                  </div>
                  {r.description && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
                    {r.category.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  {r.applicable_policies.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {r.applicable_policies.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {r.min_age}–{r.max_age}
                </td>
                <td className="px-4 py-2">
                  {["low", "medium", "high"][r.premium_level] ?? "medium"}
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(r.rider_code)}
                    disabled={deletingCode === r.rider_code}
                    aria-label={`Delete ${r.rider_name}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

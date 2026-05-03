"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PolicyListItem } from "@/lib/types/api";

interface PolicyListTableProps {
  policies: PolicyListItem[];
}

export default function PolicyListTable({ policies }: PolicyListTableProps) {
  const queryClient = useQueryClient();
  const [clearing, setClearing] = useState(false);

  async function handleClearAll() {
    const policyCount = policies.length;
    if (
      !confirm(
        `Remove ALL ${policyCount} polic${policyCount === 1 ? "y" : "ies"} from the system? You can re-upload them right after. Riders are preserved.`
      )
    )
      return;
    setClearing(true);
    try {
      await apiClient.delete(ENDPOINTS.INGEST);
      await queryClient.invalidateQueries({ queryKey: ["policies"] });
    } catch {
      alert("Failed to clear policy catalog.");
    } finally {
      setClearing(false);
    }
  }

  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No policies have been indexed yet. Upload policy documents via the
            backend API to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleClearAll}
          disabled={clearing}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          {clearing
            ? "Clearing…"
            : `Clear all policies (${policies.length})`}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm min-w-[560px]">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Policy Name</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Company</th>
            <th className="px-4 py-3 text-left font-medium">Source</th>
            <th className="px-4 py-3 text-right font-medium">Chunks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {policies.map((policy, i) => (
            <tr key={i} className="hover:bg-accent/50 transition-colors">
              <td className="px-4 py-3 font-medium">{policy.policy_name}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">
                  {POLICY_TYPE_LABELS[policy.policy_type] ||
                    policy.policy_type}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {policy.company || "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {policy.source_file}
              </td>
              <td className="px-4 py-3 text-right">{policy.chunk_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

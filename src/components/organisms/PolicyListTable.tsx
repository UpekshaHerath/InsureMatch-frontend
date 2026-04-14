import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";
import type { PolicyListItem } from "@/lib/types/api";

interface PolicyListTableProps {
  policies: PolicyListItem[];
}

export default function PolicyListTable({ policies }: PolicyListTableProps) {
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
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
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
  );
}

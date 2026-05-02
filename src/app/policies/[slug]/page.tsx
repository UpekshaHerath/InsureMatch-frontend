import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UNION_POLICIES, getPolicyBySlug } from "@/lib/data/unionPolicies";

export function generateStaticParams() {
  return UNION_POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) return { title: "Policy not found | InsureMatch" };
  return {
    title: `${policy.name} | InsureMatch`,
    description: policy.shortDescription,
  };
}

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/policies"
        className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All policies
      </Link>

      <header className="rounded-xl border border-border bg-gradient-to-br from-orange-50 via-white to-white p-8 shadow-sm">
        <Badge variant="outline" className="border-orange-200 bg-white text-orange-700">
          {policy.type}
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {policy.name}
        </h1>
        <p className="mt-4 text-base text-slate-700">{policy.longDescription}</p>

        {policy.highlights.length > 0 && (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {policy.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start text-sm text-slate-700"
              >
                <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </header>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary">
              Available Riders
            </h2>
            <p className="text-sm text-muted-foreground">
              Optional covers that can be attached to {policy.shortName ?? policy.name}.
            </p>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {policy.riders.length} total
          </span>
        </div>

        <Separator className="mb-6" />

        {policy.riders.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              This plan does not support optional rider attachments. The base
              policy already includes all bundled benefits.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {policy.riders.map((rider) => (
              <Card key={rider.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {rider.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {rider.category}
                      </p>
                    </div>
                    {rider.builtIn ? (
                      <Badge className="flex-shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Built-in
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex-shrink-0">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{rider.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

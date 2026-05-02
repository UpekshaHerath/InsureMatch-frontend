import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UNION_POLICIES } from "@/lib/data/unionPolicies";

export const metadata = {
  title: "Browse Policies | InsureMatch",
  description: "Browse Union Assurance insurance policies available in InsureMatch.",
};

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
          Union Assurance Catalogue
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Browse Insurance Policies
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Seven Union Assurance plans covering life protection, retirement,
          education, and health. Tap a card to see details and the riders that
          can be attached.
        </p>
      </header>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {UNION_POLICIES.map((policy) => (
          <Link
            key={policy.slug}
            href={`/policies/${policy.slug}`}
            className="group focus:outline-none"
          >
            <Card className="h-full border-border transition-all group-hover:border-primary/50 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                    {policy.type}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {policy.riders.length} rider{policy.riders.length === 1 ? "" : "s"}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight text-slate-900">
                  {policy.name}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm">
                  {policy.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  View details
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

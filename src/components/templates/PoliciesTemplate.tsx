"use client";

import { usePolicies } from "@/lib/hooks/usePolicies";
import PolicyListTable from "@/components/organisms/PolicyListTable";
import PolicyUploadForm from "@/components/organisms/PolicyUploadForm";
import Spinner from "@/components/atoms/Spinner";
import { Separator } from "@/components/ui/separator";

export default function PoliciesTemplate() {
  const { data: policies, isLoading, error } = usePolicies();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Upload section */}
      <section aria-labelledby="upload-heading">
        <div className="mb-4">
          <h1
            id="upload-heading"
            className="text-2xl font-bold text-secondary"
          >
            Policy Management
          </h1>
          <p className="text-muted-foreground">
            Upload new insurance policy documents or browse what is already
            indexed in the recommendation system.
          </p>
        </div>

        <PolicyUploadForm />
      </section>

      <Separator />

      {/* Indexed policies list */}
      <section aria-labelledby="policies-heading">
        <div className="mb-6">
          <h2
            id="policies-heading"
            className="text-xl font-semibold text-secondary"
          >
            Indexed Policies
          </h2>
          <p className="text-muted-foreground text-sm">
            Insurance policies currently available in the recommendation system.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            Failed to load policies. Make sure the backend is running.
          </div>
        )}

        {policies && <PolicyListTable policies={policies} />}
      </section>
    </div>
  );
}

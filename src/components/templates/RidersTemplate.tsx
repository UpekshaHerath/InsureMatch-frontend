"use client";

import { useRiders } from "@/lib/hooks/useRiders";
import RiderListTable from "@/components/organisms/RiderListTable";
import RiderUploadForm from "@/components/organisms/RiderUploadForm";
import Spinner from "@/components/atoms/Spinner";
import { Separator } from "@/components/ui/separator";

export default function RidersTemplate() {
  const { data: riders, isLoading, error } = useRiders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <section aria-labelledby="upload-heading">
        <div className="mb-4">
          <h1 id="upload-heading" className="text-2xl font-bold text-secondary">
            Rider Management
          </h1>
          <p className="text-muted-foreground">
            Upload one document describing all riders. Each rider becomes
            available as a gap-closer suggestion for applicable policies during
            user recommendations.
          </p>
        </div>
        <RiderUploadForm />
      </section>

      <Separator />

      <section aria-labelledby="riders-heading">
        <div className="mb-6">
          <h2
            id="riders-heading"
            className="text-xl font-semibold text-secondary"
          >
            Indexed Riders
          </h2>
          <p className="text-muted-foreground text-sm">
            Riders currently available to the recommendation engine.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            Failed to load riders. Make sure the backend is running.
          </div>
        )}

        {riders && <RiderListTable riders={riders} />}
      </section>
    </div>
  );
}

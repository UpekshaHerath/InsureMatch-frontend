"use client";

import { useProfileStore } from "@/lib/store/useProfileStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  HAZARDOUS_LEVEL_OPTIONS,
  INSURANCE_GOAL_OPTIONS,
} from "@/lib/utils/constants";

function getLabel(
  options: readonly { value: string; label: string }[],
  value?: string
) {
  return options.find((o) => o.value === value)?.label || value || "—";
}

interface ReviewSummaryProps {
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ReviewSummary({
  onSubmit,
  isLoading,
}: ReviewSummaryProps) {
  const { personal, occupation, goals, health, lifestyle, prevStep } =
    useProfileStore();

  const healthConditions = Object.entries(health)
    .filter(([, v]) => v === true)
    .map(([k]) =>
      k
        .replace(/^has_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Please review your information before submitting. Click on any section
        heading to go back and edit.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Age" value={personal.age?.toString()} />
            <Row label="Gender" value={getLabel(GENDER_OPTIONS, personal.gender)} />
            <Row
              label="Marital Status"
              value={getLabel(MARITAL_STATUS_OPTIONS, personal.marital_status)}
            />
            <Row label="Nationality" value={personal.nationality} />
            <Row label="Country" value={personal.country} />
            <Row label="District" value={personal.district} />
            <Row label="City" value={personal.city} />
            <Row label="Dependents" value={personal.num_dependents?.toString()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Occupation & Income</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Occupation" value={occupation.occupation} />
            <Row
              label="Employment"
              value={getLabel(
                EMPLOYMENT_TYPE_OPTIONS,
                occupation.employment_type
              )}
            />
            <Row label="Designation" value={occupation.designation} />
            <Row
              label="Hazardous Level"
              value={getLabel(
                HAZARDOUS_LEVEL_OPTIONS,
                occupation.hazardous_level
              )}
            />
            <Row
              label="Monthly Income"
              value={
                occupation.monthly_income_lkr
                  ? formatCurrency(occupation.monthly_income_lkr)
                  : undefined
              }
            />
            <Row
              label="Existing Insurance"
              value={occupation.has_existing_insurance ? "Yes" : "No"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Insurance Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row
              label="Primary Goal"
              value={getLabel(INSURANCE_GOAL_OPTIONS, goals.primary_goal)}
            />
            <Row
              label="Secondary Goal"
              value={getLabel(INSURANCE_GOAL_OPTIONS, goals.secondary_goal)}
            />
            <Row
              label="High-Risk Travel"
              value={goals.travel_history_high_risk ? "Yes" : "No"}
            />
            <Row
              label="Dual Citizenship"
              value={goals.dual_citizenship ? "Yes" : "No"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Health & Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row
              label="Health Conditions"
              value={
                healthConditions.length > 0
                  ? healthConditions.join(", ")
                  : "None reported"
              }
            />
            <Separator className="my-2" />
            <Row label="BMI" value={lifestyle.bmi?.toString()} />
            <Row label="Smoker" value={lifestyle.is_smoker ? "Yes" : "No"} />
            <Row
              label="Alcohol"
              value={lifestyle.is_alcohol_consumer ? "Yes" : "No"}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading} className="px-8">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            "Get Recommendations"
          )}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex min-w-0 justify-between gap-2">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-right font-medium">{value || "—"}</span>
    </div>
  );
}

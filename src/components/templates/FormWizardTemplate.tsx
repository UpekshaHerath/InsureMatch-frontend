"use client";

import { useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useRecommendation } from "@/lib/hooks/useRecommendation";
import StepperHeader from "@/components/organisms/StepperHeader";
import ProgressBar from "@/components/atoms/ProgressBar";
import PersonalInfoForm from "@/components/organisms/PersonalInfoForm";
import OccupationForm from "@/components/organisms/OccupationForm";
import GoalsForm from "@/components/organisms/GoalsForm";
import HealthForm from "@/components/organisms/HealthForm";
import LifestyleForm from "@/components/organisms/LifestyleForm";
import ReviewSummary from "@/components/organisms/ReviewSummary";
import { STEP_CONFIG } from "@/lib/utils/constants";

const STEP_COMPONENTS = [
  PersonalInfoForm,
  OccupationForm,
  GoalsForm,
  HealthForm,
  LifestyleForm,
];

export default function FormWizardTemplate() {
  const router = useRouter();
  const { currentStep, buildUserProfile, setRecommendationResult, markStepComplete } =
    useProfileStore();
  const recommendation = useRecommendation();

  const handleSubmit = async () => {
    const profile = buildUserProfile();
    try {
      const result = await recommendation.mutateAsync({
        user_profile: profile,
        top_k: 3,
      });
      setRecommendationResult(result);
      markStepComplete(5);
      router.push("/results");
    } catch {
      // Error is captured by TanStack Query
    }
  };

  const StepComponent =
    currentStep < 5 ? STEP_COMPONENTS[currentStep] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">
          Insurance Profile
        </h1>
        <p className="text-muted-foreground">
          Complete your profile to get personalized insurance recommendations
        </p>
      </div>

      <div className="mb-8">
        <StepperHeader />
        <div className="mt-4">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEP_CONFIG.length}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">
          {STEP_CONFIG[currentStep].label}
        </h2>

        {StepComponent ? (
          <StepComponent />
        ) : (
          <ReviewSummary
            onSubmit={handleSubmit}
            isLoading={recommendation.isPending}
          />
        )}

        {recommendation.isError && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
            Failed to get recommendations. Please ensure the backend is running
            and policy documents have been ingested.
            {recommendation.error instanceof Error && (
              <p className="mt-1 text-xs">{recommendation.error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

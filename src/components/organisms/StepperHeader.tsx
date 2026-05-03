"use client";

import StepIndicator from "@/components/molecules/StepIndicator";
import { STEP_CONFIG } from "@/lib/utils/constants";
import { useProfileStore } from "@/lib/store/useProfileStore";

export default function StepperHeader() {
  const { currentStep, completedSteps, setStep } = useProfileStore();

  const getState = (index: number) => {
    if (completedSteps.includes(index)) return "completed" as const;
    if (index === currentStep) return "active" as const;
    return "pending" as const;
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
      <div className="flex min-w-0 items-center justify-between">
        {STEP_CONFIG.map((step, index) => (
          <div key={index} className="flex min-w-0 flex-1 items-center">
            <StepIndicator
              stepNumber={index + 1}
              title={step.label}
              state={getState(index)}
              onClick={
                completedSteps.includes(index) || index === currentStep
                  ? () => setStep(index)
                  : undefined
              }
            />
            {index < STEP_CONFIG.length - 1 && (
              <div
                className={`mx-1 h-0.5 min-w-[8px] flex-1 sm:mx-2 ${
                  completedSteps.includes(index)
                    ? "bg-green-500"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

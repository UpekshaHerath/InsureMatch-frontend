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
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEP_CONFIG.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
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
                className={`flex-1 h-0.5 mx-2 ${
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

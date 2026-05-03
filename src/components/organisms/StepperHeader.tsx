"use client";

import { Fragment } from "react";

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

  const lastIndex = STEP_CONFIG.length - 1;

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
      <div className="flex items-start">
        {STEP_CONFIG.map((step, index) => (
          <Fragment key={index}>
            <div className="flex flex-col items-center">
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
            </div>
            {index < lastIndex && (
              <div
                className={`mt-[18px] mx-1 h-0.5 min-w-[8px] flex-1 sm:mx-2 ${
                  completedSteps.includes(index)
                    ? "bg-green-500"
                    : "bg-muted"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

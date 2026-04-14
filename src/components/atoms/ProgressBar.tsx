import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <Progress value={percentage} className="h-2" />
      <p className="mt-1 text-xs text-muted-foreground text-right">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}

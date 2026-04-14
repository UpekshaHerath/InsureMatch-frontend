import ImpactIndicator from "@/components/atoms/ImpactIndicator";
import type { SHAPFactor } from "@/lib/types/api";

interface SHAPFactorRowProps {
  factor: SHAPFactor;
}

export default function SHAPFactorRow({ factor }: SHAPFactorRowProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{factor.feature}</p>
        <p className="text-xs text-muted-foreground">{factor.reason}</p>
      </div>
      <ImpactIndicator
        direction={factor.direction}
        score={factor.impact_score}
      />
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  healthInfoSchema,
  type HealthInfoFormData,
} from "@/lib/validators/profile";
import { useProfileStore } from "@/lib/store/useProfileStore";
import CheckboxField from "@/components/molecules/CheckboxField";
import { Button } from "@/components/ui/button";
import { HEALTH_CONDITIONS } from "@/lib/utils/constants";

export default function HealthForm() {
  const { health, updateHealth, nextStep, prevStep, markStepComplete } =
    useProfileStore();

  const { handleSubmit, setValue, watch } = useForm<HealthInfoFormData>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      has_chronic_disease: health.has_chronic_disease ?? false,
      has_cardiovascular: health.has_cardiovascular ?? false,
      has_cancer: health.has_cancer ?? false,
      has_respiratory: health.has_respiratory ?? false,
      has_neurological: health.has_neurological ?? false,
      has_gastrointestinal: health.has_gastrointestinal ?? false,
      has_musculoskeletal: health.has_musculoskeletal ?? false,
      has_infectious_sexual: health.has_infectious_sexual ?? false,
      recent_treatment_surgery: health.recent_treatment_surgery ?? false,
      covid_related: health.covid_related ?? false,
    },
  });

  const onSubmit = (data: HealthInfoFormData) => {
    updateHealth(data);
    markStepComplete(3);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select any health conditions that apply to you. This helps us recommend
        the most suitable policies.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {HEALTH_CONDITIONS.map((condition) => (
          <CheckboxField
            key={condition.key}
            label={condition.label}
            description={condition.description}
            name={condition.key}
            checked={watch(condition.key as keyof HealthInfoFormData) ?? false}
            onCheckedChange={(val) =>
              setValue(condition.key as keyof HealthInfoFormData, val)
            }
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit" className="px-8">
          Next
        </Button>
      </div>
    </form>
  );
}

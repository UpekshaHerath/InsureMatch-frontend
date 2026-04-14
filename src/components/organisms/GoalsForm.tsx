"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  goalsInfoSchema,
  type GoalsInfoFormData,
} from "@/lib/validators/profile";
import { useProfileStore } from "@/lib/store/useProfileStore";
import SelectField from "@/components/molecules/SelectField";
import CheckboxField from "@/components/molecules/CheckboxField";
import { Button } from "@/components/ui/button";
import { INSURANCE_GOAL_OPTIONS } from "@/lib/utils/constants";

export default function GoalsForm() {
  const { goals, updateGoals, nextStep, prevStep, markStepComplete } =
    useProfileStore();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalsInfoFormData>({
    resolver: zodResolver(goalsInfoSchema),
    defaultValues: {
      primary_goal: goals.primary_goal,
      secondary_goal: goals.secondary_goal || "none",
      travel_history_high_risk: goals.travel_history_high_risk ?? false,
      dual_citizenship: goals.dual_citizenship ?? false,
      tax_regulatory_flags: goals.tax_regulatory_flags ?? false,
      insurance_history_issues: goals.insurance_history_issues ?? false,
    },
  });

  const onSubmit = (data: GoalsInfoFormData) => {
    updateGoals(data);
    markStepComplete(2);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SelectField
          label="Primary Goal"
          name="primary_goal"
          options={INSURANCE_GOAL_OPTIONS}
          value={watch("primary_goal")}
          onValueChange={(val) =>
            setValue(
              "primary_goal",
              val as GoalsInfoFormData["primary_goal"],
              { shouldValidate: true }
            )
          }
          error={errors.primary_goal?.message}
          required
        />
        <SelectField
          label="Secondary Goal"
          name="secondary_goal"
          options={INSURANCE_GOAL_OPTIONS}
          value={watch("secondary_goal")}
          onValueChange={(val) =>
            setValue(
              "secondary_goal",
              val as GoalsInfoFormData["secondary_goal"],
              { shouldValidate: true }
            )
          }
          error={errors.secondary_goal?.message}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CheckboxField
            label="High-Risk Travel History"
            description="Travel to high-risk countries in the past 2 years"
            name="travel_history_high_risk"
            checked={watch("travel_history_high_risk")}
            onCheckedChange={(val) =>
              setValue("travel_history_high_risk", val)
            }
          />
          <CheckboxField
            label="Dual Citizenship"
            description="Hold citizenship in more than one country"
            name="dual_citizenship"
            checked={watch("dual_citizenship")}
            onCheckedChange={(val) => setValue("dual_citizenship", val)}
          />
          <CheckboxField
            label="Tax / Regulatory Flags"
            description="Any tax or regulatory compliance issues"
            name="tax_regulatory_flags"
            checked={watch("tax_regulatory_flags")}
            onCheckedChange={(val) => setValue("tax_regulatory_flags", val)}
          />
          <CheckboxField
            label="Insurance History Issues"
            description="Previous claims denied or policies cancelled"
            name="insurance_history_issues"
            checked={watch("insurance_history_issues")}
            onCheckedChange={(val) =>
              setValue("insurance_history_issues", val)
            }
          />
        </div>
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

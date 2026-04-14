"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  occupationInfoSchema,
  type OccupationInfoFormData,
} from "@/lib/validators/profile";
import { useProfileStore } from "@/lib/store/useProfileStore";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import CheckboxField from "@/components/molecules/CheckboxField";
import { Button } from "@/components/ui/button";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  HAZARDOUS_LEVEL_OPTIONS,
  INSURANCE_STATUS_OPTIONS,
} from "@/lib/utils/constants";

export default function OccupationForm() {
  const { occupation, updateOccupation, nextStep, prevStep, markStepComplete } =
    useProfileStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OccupationInfoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(occupationInfoSchema) as any,
    defaultValues: {
      occupation: occupation.occupation || "",
      employment_type: occupation.employment_type,
      designation: occupation.designation || "",
      hazardous_level: occupation.hazardous_level || "none",
      hazardous_activities: occupation.hazardous_activities || "",
      monthly_income_lkr: occupation.monthly_income_lkr,
      has_existing_insurance: occupation.has_existing_insurance ?? false,
      current_insurance_status:
        occupation.current_insurance_status || "none",
      employer_insurance_scheme:
        occupation.employer_insurance_scheme || "",
    },
  });

  const onSubmit = (data: OccupationInfoFormData) => {
    updateOccupation(data);
    markStepComplete(1);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Occupation"
          registration={register("occupation")}
          placeholder="Software Engineer"
          error={errors.occupation?.message}
          required
        />
        <SelectField
          label="Employment Type"
          name="employment_type"
          options={EMPLOYMENT_TYPE_OPTIONS}
          value={watch("employment_type")}
          onValueChange={(val) =>
            setValue(
              "employment_type",
              val as OccupationInfoFormData["employment_type"],
              { shouldValidate: true }
            )
          }
          error={errors.employment_type?.message}
          required
        />
        <FormField
          label="Designation"
          registration={register("designation")}
          placeholder="Senior Developer"
          error={errors.designation?.message}
        />
        <SelectField
          label="Hazardous Level"
          name="hazardous_level"
          options={HAZARDOUS_LEVEL_OPTIONS}
          value={watch("hazardous_level")}
          onValueChange={(val) =>
            setValue(
              "hazardous_level",
              val as OccupationInfoFormData["hazardous_level"],
              { shouldValidate: true }
            )
          }
          error={errors.hazardous_level?.message}
        />
        <FormField
          label="Hazardous Activities"
          registration={register("hazardous_activities")}
          placeholder="e.g., working at heights"
          error={errors.hazardous_activities?.message}
        />
        <FormField
          label="Monthly Income (LKR)"
          registration={register("monthly_income_lkr")}
          type="number"
          placeholder="150000"
          error={errors.monthly_income_lkr?.message}
          required
        />
        <SelectField
          label="Insurance Status"
          name="current_insurance_status"
          options={INSURANCE_STATUS_OPTIONS}
          value={watch("current_insurance_status")}
          onValueChange={(val) =>
            setValue(
              "current_insurance_status",
              val as OccupationInfoFormData["current_insurance_status"],
              { shouldValidate: true }
            )
          }
          error={errors.current_insurance_status?.message}
        />
        <FormField
          label="Employer Insurance Scheme"
          registration={register("employer_insurance_scheme")}
          placeholder="Company group insurance"
          error={errors.employer_insurance_scheme?.message}
        />
      </div>

      <div className="col-span-2">
        <CheckboxField
          label="Has Existing Insurance"
          description="Check if you currently have any personal insurance policy"
          name="has_existing_insurance"
          checked={watch("has_existing_insurance")}
          onCheckedChange={(val) => setValue("has_existing_insurance", val)}
        />
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

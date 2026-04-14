"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  lifestyleInfoSchema,
  type LifestyleInfoFormData,
} from "@/lib/validators/profile";
import { useProfileStore } from "@/lib/store/useProfileStore";
import FormField from "@/components/molecules/FormField";
import CheckboxField from "@/components/molecules/CheckboxField";
import { Button } from "@/components/ui/button";

export default function LifestyleForm() {
  const { lifestyle, updateLifestyle, nextStep, prevStep, markStepComplete } =
    useProfileStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<LifestyleInfoFormData>({
    resolver: zodResolver(lifestyleInfoSchema) as any,
    defaultValues: {
      bmi: lifestyle.bmi,
      is_smoker: lifestyle.is_smoker ?? false,
      is_alcohol_consumer: lifestyle.is_alcohol_consumer ?? false,
    },
  });

  const onSubmit = (data: LifestyleInfoFormData) => {
    updateLifestyle(data);
    markStepComplete(4);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-w-sm">
        <FormField
          label="BMI (Body Mass Index)"
          registration={register("bmi")}
          type="number"
          placeholder="22.5"
          error={errors.bmi?.message}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          BMI = weight(kg) / height(m)&sup2;. Normal range: 18.5 - 24.9
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Habits</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CheckboxField
            label="Smoker"
            description="Currently smoke or use tobacco products"
            name="is_smoker"
            checked={watch("is_smoker")}
            onCheckedChange={(val) => setValue("is_smoker", val)}
          />
          <CheckboxField
            label="Alcohol Consumer"
            description="Regular alcohol consumption"
            name="is_alcohol_consumer"
            checked={watch("is_alcohol_consumer")}
            onCheckedChange={(val) => setValue("is_alcohol_consumer", val)}
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

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/lib/validators/profile";
import { useProfileStore } from "@/lib/store/useProfileStore";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import { Button } from "@/components/ui/button";
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/utils/constants";

export default function PersonalInfoForm() {
  const { personal, updatePersonal, nextStep, markStepComplete } =
    useProfileStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      age: personal.age,
      gender: personal.gender,
      marital_status: personal.marital_status,
      nationality: personal.nationality || "Sri Lankan",
      country: personal.country || "Sri Lanka",
      district: personal.district || "",
      city: personal.city || "",
      num_dependents: personal.num_dependents ?? 0,
    },
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    updatePersonal(data);
    markStepComplete(0);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Age"
          registration={register("age")}
          type="number"
          placeholder="25"
          error={errors.age?.message}
          required
        />
        <SelectField
          label="Gender"
          name="gender"
          options={GENDER_OPTIONS}
          value={watch("gender")}
          onValueChange={(val) =>
            setValue("gender", val as PersonalInfoFormData["gender"], {
              shouldValidate: true,
            })
          }
          error={errors.gender?.message}
          required
        />
        <SelectField
          label="Marital Status"
          name="marital_status"
          options={MARITAL_STATUS_OPTIONS}
          value={watch("marital_status")}
          onValueChange={(val) =>
            setValue(
              "marital_status",
              val as PersonalInfoFormData["marital_status"],
              { shouldValidate: true }
            )
          }
          error={errors.marital_status?.message}
          required
        />
        <FormField
          label="Nationality"
          registration={register("nationality")}
          placeholder="Sri Lankan"
          error={errors.nationality?.message}
        />
        <FormField
          label="Country"
          registration={register("country")}
          placeholder="Sri Lanka"
          error={errors.country?.message}
        />
        <FormField
          label="District"
          registration={register("district")}
          placeholder="Colombo"
          error={errors.district?.message}
        />
        <FormField
          label="City"
          registration={register("city")}
          placeholder="Colombo 03"
          error={errors.city?.message}
        />
        <FormField
          label="Number of Dependents"
          registration={register("num_dependents")}
          type="number"
          placeholder="0"
          error={errors.num_dependents?.message}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Next
        </Button>
      </div>
    </form>
  );
}

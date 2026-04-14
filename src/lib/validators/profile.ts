import { z } from "zod";

export const personalInfoSchema = z.object({
  age: z.coerce
    .number({ message: "Age is required" })
    .min(18, "Must be at least 18")
    .max(70, "Must be at most 70"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  marital_status: z.enum(["single", "married", "divorced", "widowed"], {
    message: "Please select marital status",
  }),
  nationality: z.string(),
  country: z.string(),
  district: z.string().optional(),
  city: z.string().optional(),
  num_dependents: z.coerce
    .number()
    .min(0, "Cannot be negative")
    .max(20, "Maximum 20"),
});

export const occupationInfoSchema = z.object({
  occupation: z
    .string({ message: "Occupation is required" })
    .min(1, "Occupation is required"),
  employment_type: z.enum(
    ["permanent", "contract", "freelance", "self_employed", "unemployed", "retired"],
    { message: "Please select employment type" }
  ),
  designation: z.string().optional(),
  hazardous_level: z.enum(["none", "low", "medium", "high"]),
  hazardous_activities: z.string().optional(),
  monthly_income_lkr: z.coerce
    .number({ message: "Monthly income is required" })
    .positive("Income must be positive"),
  has_existing_insurance: z.boolean(),
  current_insurance_status: z.enum(["none", "has_insurance"]),
  employer_insurance_scheme: z.string().optional(),
});

const insuranceGoalEnum = z.enum([
  "cheap_and_quick",
  "protection",
  "savings_and_investment",
  "health_coverage",
  "retirement",
  "none",
]);

export const goalsInfoSchema = z.object({
  primary_goal: insuranceGoalEnum,
  secondary_goal: insuranceGoalEnum,
  travel_history_high_risk: z.boolean(),
  dual_citizenship: z.boolean(),
  tax_regulatory_flags: z.boolean(),
  insurance_history_issues: z.boolean(),
});

export const healthInfoSchema = z.object({
  has_chronic_disease: z.boolean(),
  has_cardiovascular: z.boolean(),
  has_cancer: z.boolean(),
  has_respiratory: z.boolean(),
  has_neurological: z.boolean(),
  has_gastrointestinal: z.boolean(),
  has_musculoskeletal: z.boolean(),
  has_infectious_sexual: z.boolean(),
  recent_treatment_surgery: z.boolean(),
  covid_related: z.boolean(),
});

export const lifestyleInfoSchema = z.object({
  bmi: z.coerce
    .number({ message: "BMI is required" })
    .positive("BMI must be positive")
    .max(60, "BMI seems too high"),
  is_smoker: z.boolean(),
  is_alcohol_consumer: z.boolean(),
});

export type PersonalInfoFormData = z.output<typeof personalInfoSchema>;
export type OccupationInfoFormData = z.output<typeof occupationInfoSchema>;
export type GoalsInfoFormData = z.output<typeof goalsInfoSchema>;
export type HealthInfoFormData = z.output<typeof healthInfoSchema>;
export type LifestyleInfoFormData = z.output<typeof lifestyleInfoSchema>;

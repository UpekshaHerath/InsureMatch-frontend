export const STEP_CONFIG = [
  { label: "Personal Info", description: "Basic personal details" },
  { label: "Occupation", description: "Work & income details" },
  { label: "Insurance Goals", description: "Coverage preferences" },
  { label: "Health Info", description: "Medical history" },
  { label: "Lifestyle", description: "Habits & lifestyle" },
  { label: "Review", description: "Confirm & submit" },
] as const;

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "permanent", label: "Permanent" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "self_employed", label: "Self Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
] as const;

export const HAZARDOUS_LEVEL_OPTIONS = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const INSURANCE_STATUS_OPTIONS = [
  { value: "none", label: "No Insurance" },
  { value: "has_insurance", label: "Has Insurance" },
] as const;

export const INSURANCE_GOAL_OPTIONS = [
  { value: "cheap_and_quick", label: "Affordable & Quick Coverage" },
  { value: "protection", label: "Family Protection" },
  { value: "savings_and_investment", label: "Savings & Investment" },
  { value: "health_coverage", label: "Health Coverage" },
  { value: "retirement", label: "Retirement Planning" },
  { value: "none", label: "Not Sure / None" },
] as const;

export const POLICY_TYPE_LABELS: Record<string, string> = {
  term_life: "Term Life",
  whole_life: "Whole Life",
  endowment: "Endowment",
  health: "Health",
  critical_illness: "Critical Illness",
  accident: "Accident",
};

export const HEALTH_CONDITIONS = [
  { key: "has_chronic_disease", label: "Chronic Disease", description: "Diabetes, hypertension, or other chronic conditions" },
  { key: "has_cardiovascular", label: "Cardiovascular", description: "Heart disease, stroke, or related conditions" },
  { key: "has_cancer", label: "Cancer", description: "Any form of cancer, past or present" },
  { key: "has_respiratory", label: "Respiratory", description: "Asthma, COPD, or other respiratory conditions" },
  { key: "has_neurological", label: "Neurological", description: "Epilepsy, Parkinson's, or other neurological conditions" },
  { key: "has_gastrointestinal", label: "Gastrointestinal", description: "IBS, Crohn's, or other GI conditions" },
  { key: "has_musculoskeletal", label: "Musculoskeletal", description: "Arthritis, back problems, or joint issues" },
  { key: "has_infectious_sexual", label: "Infectious / Sexual Health", description: "HIV, hepatitis, or STIs" },
  { key: "has_recent_treatment_surgery" as string, label: "Recent Treatment / Surgery", description: "Any treatment or surgery in the past 12 months" },
  { key: "covid_related", label: "COVID-19 Related", description: "Long COVID or related complications" },
] as const;

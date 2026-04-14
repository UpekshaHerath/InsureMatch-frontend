// Enums matching backend schemas.py

export type Gender = "male" | "female" | "other";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export type EmploymentType =
  | "permanent"
  | "contract"
  | "freelance"
  | "self_employed"
  | "unemployed"
  | "retired";

export type HazardousLevel = "none" | "low" | "medium" | "high";

export type InsuranceStatus = "none" | "has_insurance";

export type InsuranceGoal =
  | "cheap_and_quick"
  | "protection"
  | "savings_and_investment"
  | "health_coverage"
  | "retirement"
  | "none";

// User Profile sections

export interface PersonalInfo {
  age: number;
  gender: Gender;
  marital_status: MaritalStatus;
  nationality: string;
  country: string;
  district?: string;
  city?: string;
  num_dependents: number;
}

export interface OccupationInfo {
  occupation: string;
  employment_type: EmploymentType;
  designation?: string;
  hazardous_level: HazardousLevel;
  hazardous_activities?: string;
  monthly_income_lkr: number;
  has_existing_insurance: boolean;
  current_insurance_status: InsuranceStatus;
  employer_insurance_scheme?: string;
}

export interface InsuranceGoalInfo {
  primary_goal: InsuranceGoal;
  secondary_goal?: InsuranceGoal;
  travel_history_high_risk: boolean;
  dual_citizenship: boolean;
  tax_regulatory_flags: boolean;
  insurance_history_issues: boolean;
}

export interface HealthInfo {
  has_chronic_disease: boolean;
  has_cardiovascular: boolean;
  has_cancer: boolean;
  has_respiratory: boolean;
  has_neurological: boolean;
  has_gastrointestinal: boolean;
  has_musculoskeletal: boolean;
  has_infectious_sexual: boolean;
  recent_treatment_surgery: boolean;
  covid_related: boolean;
}

export interface LifestyleInfo {
  bmi: number;
  is_smoker: boolean;
  is_alcohol_consumer: boolean;
}

export interface UserProfile {
  personal: PersonalInfo;
  occupation: OccupationInfo;
  goals: InsuranceGoalInfo;
  health: HealthInfo;
  lifestyle: LifestyleInfo;
}

// API Response types

export interface SHAPFactor {
  feature: string;
  impact_score: number;
  direction: "positive" | "negative";
  reason: string;
}

export interface PolicyScore {
  policy_name: string;
  policy_type: string;
  company: string | null;
  suitability_score: number;
  rank: number;
}

export interface PolicyExplanation {
  policy_name: string;
  suitability_score: number;
  positive_factors: SHAPFactor[];
  negative_factors: SHAPFactor[];
  shap_summary: string;
}

export interface RecommendationResponse {
  ranked_policies: PolicyScore[];
  top_recommendation: string;
  explanations: PolicyExplanation[];
  rag_narrative: string;
  session_id: string;
}

export interface RecommendationRequest {
  user_profile: UserProfile;
  top_k?: number;
}

export interface ChatRequest {
  session_id: string;
  message: string;
  user_profile?: UserProfile;
}

export interface ChatResponse {
  session_id: string;
  response: string;
  sources: string[];
}

export interface ExplainRequest {
  user_profile: UserProfile;
  policy_name: string;
}

export interface PolicyListItem {
  policy_name: string;
  policy_type: string;
  company: string | null;
  source_file: string;
  chunk_count: number;
}

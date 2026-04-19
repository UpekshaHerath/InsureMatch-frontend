"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  PersonalInfo,
  OccupationInfo,
  InsuranceGoalInfo,
  HealthInfo,
  LifestyleInfo,
  UserProfile,
  RecommendationResponse,
} from "@/lib/types/api";

interface ProfileState {
  currentStep: number;
  personal: Partial<PersonalInfo>;
  occupation: Partial<OccupationInfo>;
  goals: Partial<InsuranceGoalInfo>;
  health: Partial<HealthInfo>;
  lifestyle: Partial<LifestyleInfo>;
  completedSteps: number[];
  recommendationResult: RecommendationResponse | null;
  sessionId: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updateOccupation: (data: Partial<OccupationInfo>) => void;
  updateGoals: (data: Partial<InsuranceGoalInfo>) => void;
  updateHealth: (data: Partial<HealthInfo>) => void;
  updateLifestyle: (data: Partial<LifestyleInfo>) => void;
  markStepComplete: (step: number) => void;
  setRecommendationResult: (result: RecommendationResponse) => void;
  buildUserProfile: () => UserProfile;
  loadFromDbRow: (row: Record<string, unknown>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  personal: {},
  occupation: {},
  goals: {},
  health: {},
  lifestyle: {},
  completedSteps: [],
  recommendationResult: null,
  sessionId: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      updatePersonal: (data) =>
        set((state) => ({ personal: { ...state.personal, ...data } })),
      updateOccupation: (data) =>
        set((state) => ({ occupation: { ...state.occupation, ...data } })),
      updateGoals: (data) =>
        set((state) => ({ goals: { ...state.goals, ...data } })),
      updateHealth: (data) =>
        set((state) => ({ health: { ...state.health, ...data } })),
      updateLifestyle: (data) =>
        set((state) => ({ lifestyle: { ...state.lifestyle, ...data } })),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      setRecommendationResult: (result) =>
        set({ recommendationResult: result, sessionId: result.session_id }),

      buildUserProfile: (): UserProfile => {
        const state = get();
        return {
          personal: {
            age: state.personal.age ?? 30,
            gender: state.personal.gender ?? "male",
            marital_status: state.personal.marital_status ?? "single",
            nationality: state.personal.nationality ?? "Sri Lankan",
            country: state.personal.country ?? "Sri Lanka",
            district: state.personal.district,
            city: state.personal.city,
            num_dependents: state.personal.num_dependents ?? 0,
          },
          occupation: {
            occupation: state.occupation.occupation ?? "",
            employment_type: state.occupation.employment_type ?? "permanent",
            designation: state.occupation.designation,
            hazardous_level: state.occupation.hazardous_level ?? "none",
            hazardous_activities: state.occupation.hazardous_activities,
            monthly_income_lkr: state.occupation.monthly_income_lkr ?? 0,
            has_existing_insurance:
              state.occupation.has_existing_insurance ?? false,
            current_insurance_status:
              state.occupation.current_insurance_status ?? "none",
            employer_insurance_scheme:
              state.occupation.employer_insurance_scheme,
          },
          goals: {
            primary_goal: state.goals.primary_goal ?? "protection",
            secondary_goal: state.goals.secondary_goal ?? "none",
            travel_history_high_risk:
              state.goals.travel_history_high_risk ?? false,
            dual_citizenship: state.goals.dual_citizenship ?? false,
            tax_regulatory_flags: state.goals.tax_regulatory_flags ?? false,
            insurance_history_issues:
              state.goals.insurance_history_issues ?? false,
          },
          health: {
            has_chronic_disease: state.health.has_chronic_disease ?? false,
            has_cardiovascular: state.health.has_cardiovascular ?? false,
            has_cancer: state.health.has_cancer ?? false,
            has_respiratory: state.health.has_respiratory ?? false,
            has_neurological: state.health.has_neurological ?? false,
            has_gastrointestinal: state.health.has_gastrointestinal ?? false,
            has_musculoskeletal: state.health.has_musculoskeletal ?? false,
            has_infectious_sexual:
              state.health.has_infectious_sexual ?? false,
            recent_treatment_surgery:
              state.health.recent_treatment_surgery ?? false,
            covid_related: state.health.covid_related ?? false,
          },
          lifestyle: {
            bmi: state.lifestyle.bmi ?? 22,
            is_smoker: state.lifestyle.is_smoker ?? false,
            is_alcohol_consumer: state.lifestyle.is_alcohol_consumer ?? false,
          },
        };
      },

      loadFromDbRow: (row) => {
        // Skip prefill if DB row has no meaningful profile data (e.g. fresh signup — only user_id/full_name set)
        const hasData =
          row.age != null ||
          row.occupation != null ||
          row.primary_goal != null ||
          row.bmi != null;
        if (!hasData) return;

        // Only overwrite fields that have non-null values in DB. Preserve existing Zustand state otherwise.
        const pick = <T,>(
          current: T | undefined,
          key: string
        ): T | undefined => {
          const v = row[key];
          return v == null ? current : (v as T);
        };

        set((state) => ({
          personal: {
            age: pick(state.personal.age, "age"),
            gender: pick(state.personal.gender, "gender"),
            marital_status: pick(state.personal.marital_status, "marital_status"),
            nationality: pick(state.personal.nationality, "nationality"),
            country: pick(state.personal.country, "country"),
            district: pick(state.personal.district, "district"),
            city: pick(state.personal.city, "city"),
            num_dependents: pick(state.personal.num_dependents, "num_dependents"),
          },
          occupation: {
            occupation: pick(state.occupation.occupation, "occupation"),
            employment_type: pick(state.occupation.employment_type, "employment_type"),
            designation: pick(state.occupation.designation, "designation"),
            hazardous_level: pick(state.occupation.hazardous_level, "hazardous_level"),
            hazardous_activities: pick(state.occupation.hazardous_activities, "hazardous_activities"),
            monthly_income_lkr: pick(state.occupation.monthly_income_lkr, "monthly_income_lkr"),
            has_existing_insurance: pick(state.occupation.has_existing_insurance, "has_existing_insurance"),
            current_insurance_status: pick(state.occupation.current_insurance_status, "current_insurance_status"),
            employer_insurance_scheme: pick(state.occupation.employer_insurance_scheme, "employer_insurance_scheme"),
          },
          goals: {
            primary_goal: pick(state.goals.primary_goal, "primary_goal"),
            secondary_goal: pick(state.goals.secondary_goal, "secondary_goal"),
            travel_history_high_risk: pick(state.goals.travel_history_high_risk, "travel_history_high_risk"),
            dual_citizenship: pick(state.goals.dual_citizenship, "dual_citizenship"),
            tax_regulatory_flags: pick(state.goals.tax_regulatory_flags, "tax_regulatory_flags"),
            insurance_history_issues: pick(state.goals.insurance_history_issues, "insurance_history_issues"),
          },
          health: {
            has_chronic_disease: pick(state.health.has_chronic_disease, "has_chronic_disease"),
            has_cardiovascular: pick(state.health.has_cardiovascular, "has_cardiovascular"),
            has_cancer: pick(state.health.has_cancer, "has_cancer"),
            has_respiratory: pick(state.health.has_respiratory, "has_respiratory"),
            has_neurological: pick(state.health.has_neurological, "has_neurological"),
            has_gastrointestinal: pick(state.health.has_gastrointestinal, "has_gastrointestinal"),
            has_musculoskeletal: pick(state.health.has_musculoskeletal, "has_musculoskeletal"),
            has_infectious_sexual: pick(state.health.has_infectious_sexual, "has_infectious_sexual"),
            recent_treatment_surgery: pick(state.health.recent_treatment_surgery, "recent_treatment_surgery"),
            covid_related: pick(state.health.covid_related, "covid_related"),
          },
          lifestyle: {
            bmi: pick(state.lifestyle.bmi, "bmi"),
            is_smoker: pick(state.lifestyle.is_smoker, "is_smoker"),
            is_alcohol_consumer: pick(state.lifestyle.is_alcohol_consumer, "is_alcohol_consumer"),
          },
        }));
      },

      reset: () => set(initialState),
    }),
    {
      name: "insure-match-profile",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        personal: state.personal,
        occupation: state.occupation,
        goals: state.goals,
        health: state.health,
        lifestyle: state.lifestyle,
        completedSteps: state.completedSteps,
        recommendationResult: state.recommendationResult,
        sessionId: state.sessionId,
      }),
    }
  )
);

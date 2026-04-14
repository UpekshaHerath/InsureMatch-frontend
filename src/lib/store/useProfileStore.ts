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

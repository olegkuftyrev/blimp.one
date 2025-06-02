// src/store/useAppStore.js
import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  // ----- IDP flow -----
  jobTitleId: null,
  focusAreaIds: [],

  setJobTitle: (id) => set({ jobTitleId: id }),
  toggleFocusArea: (id) =>
    set((state) => {
      const exists = state.focusAreaIds.includes(id);
      return {
        focusAreaIds: exists
          ? state.focusAreaIds.filter((x) => x !== id)
          : [...state.focusAreaIds, id],
      };
    }),

  currentStep: 0,
  nextStep: () =>
    set((state) => {
      const max = 1;
      return { currentStep: Math.min(state.currentStep + 1, max) };
    }),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  competencyScores: {},
  setCompetencyScores: (scores) => set({ competencyScores: scores }),

  // Добавляем булев флаг для Competencies
  focusSkills: {
    competency: false,
    study: false,
    practice: false,
    mentorship: false,
  },
  setFocusSkill: (skillType, value) =>
    set((state) => ({
      focusSkills: { ...state.focusSkills, [skillType]: value },
    })),
}));

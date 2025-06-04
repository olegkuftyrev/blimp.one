// src/store/useAppStore.js
import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  /* ───────────── IDP FLOW ───────────── */
  jobTitleId: null,
  focusAreaIds: [],

  setJobTitle: (id) => set({ jobTitleId: id }),
  toggleFocusArea: (id) =>
    set((state) => ({
      focusAreaIds: state.focusAreaIds.includes(id)
        ? state.focusAreaIds.filter((x) => x !== id)
        : [...state.focusAreaIds, id],
    })),

  /* шаги внутри IDP */
  currentStep: 0,
  nextStep: () =>
    set((s) => ({ currentStep: Math.min(s.currentStep + 1, 1) })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  /* результаты само-оценки */
  competencyScores: {},
  setCompetencyScores: (scores) => set({ competencyScores: scores }),

  /* выбранные карточки Focus */
  focusSkills: {
    competency: false,
    study: false,
    practice: false,
    mentorship: false,
  },
  setFocusSkill: (skill, value) =>
    set((s) => ({
      focusSkills: { ...s.focusSkills, [skill]: value },
    })),

  /* ───────────── P&L DASHBOARD ───────────── */
  /** «Сырые» строки Excel (sheet_to_json range) */
  plRows: [],
  /** Объект «ключ → Actuals» (быстрый доступ к метрикам) */
  plValues: {},

  /**
   * Сохраняем данные Excel сразу в оба формата
   * @param {array[]} rows  — массив строк
   * @param {object}  values — объект «ключ → значение»
   */
  setPlData: (rows, values) => set({ plRows: rows, plValues: values }),
}));

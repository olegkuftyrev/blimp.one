// src/data/roles.js
// -----------------------------------------------------------------------------
// Added one random skill from the "cook" skills list to each role that had an empty skills array.
// -----------------------------------------------------------------------------

import { skills } from "./skills.js";
import { competencies as comp } from "./competencies.js";

/**
 * Helper to fetch a competency object by its id.
 * @param {string} id
 * @returns {import('./competencies.js').CompetencyItem | undefined}
 */
const getComp = (id) => comp.find((c) => c.id === id);

/**
 * Helper to fetch a skill object by its id.
 * @param {string} id
 * @returns {import('./skills.js').Skill | undefined}
 */
const getSkill = (id) => skills.find((s) => s.id === id);

export const roles = [
  // --------------------------------------------------- Associates
  {
    label: "counter-help",
    title: "Counter Help",
    description: "Greets guests, takes orders, serves meals and drinks.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality")
    ].filter(Boolean),
    skills: [
      getSkill('culture'),
      getSkill('feedback'),
      getSkill('attendanceAccountability'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  {
    label: "kitchen-help",
    title: "Kitchen Help",
    description: "Preps ingredients, stocks line, maintains sanitation.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('integrityTrust'),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
    ].filter(Boolean),
    // Added "foodPreparation" as a random cook skill
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  {
    label: "shift-leader",
    title: "Shift Leader",
    description: "Runs the shift, coaches crew, resolves in-store issues.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('integrityTrust'),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
    ].filter(Boolean),
    // Added "tableTouches" as a random cook skill
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  {
    label: "cook",
    title: "Cook",
    description: "Executes recipes, controls quality, handles the wok line.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
      getComp('integrityTrust'),
    ].filter(Boolean),
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  // --------------------------------------------------- AM & Chef tier
  {
    label: "assistant-manager",
    title: "Assistant Manager",
    description: "Supports GM, oversees daily ops, trains associates.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('integrityTrust'),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
      getComp('businessInsight'),
      getComp('attractsDevelopsTalent'),
      getComp('beingResilient'),
    ].filter(Boolean),
    // Added "serviceAreaOpening" as a random cook skill
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  {
    label: "chef",
    title: "Chef",
    description: "Leads kitchen, develops menu items, maintains food quality.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('integrityTrust'),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
      getComp('businessInsight'),
      getComp('attractsDevelopsTalent'),
      getComp('beingResilient'),
    ].filter(Boolean),
    // Added "dishwashingProcedures" as a random cook skill
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },

  // --------------------------------------------------- SM / GM tier
  {
    label: "store-manager",
    title: "Store Manager",
    description: "Owns full P&L, leads staff, ensures brand standards.",
    competencies: [
      getComp("customerFocus"),
      getComp("decisionQuality"),
      getComp("ensuresAccountability"),
      getComp("valuesDifferences"),
      getComp('integrityTrust'),
      getComp('actionOriented'),
      getComp('communicatesEffectively'),
      getComp('businessInsight'),
      getComp('attractsDevelopsTalent'),
      getComp('beingResilient'),
    ].filter(Boolean),
    // Added "inventoryCounting" as a random cook skill
    skills: [
      getSkill('culture'),
      getSkill('culture2'),
      getSkill('feedback2'),
      getSkill('attendanceAccountability2'),
    ].filter(Boolean),
  },
];

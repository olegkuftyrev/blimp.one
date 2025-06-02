// src/data/skills.js
// -----------------------------------------------------------------------------
// Added real links for a random selection of skills; the rest remain "TBD".
// -----------------------------------------------------------------------------

/**
 * @typedef {Object} Skill
 * @property {string} id
 * @property {string} label
 * @property {string} learningStyle
 * @property {string} note
 * @property {string} reference
 */

/** @type {Skill[]} */
export const skills = [
  {
    id: "culture",
    label: "Panda Culture",
    learningStyle: "study",
    note: "Mission, Values, Vision, Environment, Panda Way",
    reference: "https://pandawiki.com/culture",
  },
  {
    id: "feedback",
    label: "Feedback in Empowering Way",
    learningStyle: "practice",
    note: "Able to provide instant feedback in an empowering way",
    reference: "https://pandawiki.com/feedback-empowering",
  },
  {
    id: "attendanceAccountability",
    label: "Accountability for Attendance & Urgency",
    learningStyle: "mentorship",
    note: "Able to hold people accountable for attendance and sense of urgency",
    reference: "TBD",
  },
  {
    id: "culture2",
    label: "Panda Culture",
    learningStyle: "mentorship",
    note: "Mission, Values, Vision, Environment, Panda Way",
    reference: "https://pandawiki.com/culture",
  },
  {
    id: "feedback2",
    label: "Feedback in Empowering Way",
    learningStyle: "mentorship",
    note: "Able to provide instant feedback in an empowering way",
    reference: "https://pandawiki.com/feedback-empowering",
  },
  {
    id: "attendanceAccountability2",
    label: "Accountability for Attendance & Urgency",
    learningStyle: "study",
    note: "Able to hold people accountable for attendance and sense of urgency",
    reference: "TBD",
  }
];

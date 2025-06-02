// src/data/competencies.js
// -----------------------------------------------------------------------------

/**
 * @typedef {Object} Action
 * @property {string} id
 * @property {string} action
 *
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} question
 *
 * @typedef {Object} CompetencyItem
 * @property {string} id
 * @property {string} label
 * @property {Question[]} questions
 * @property {Action[]} actions
 */

/** @type {CompetencyItem[]} */
export const competencies = [
  {
    id: "businessInsight",
    label: "Business Insight",
    questions: [
      { id: "businessInsight-q1", question: "How well do you understand the key drivers of our business model?" },
      { id: "businessInsight-q2", question: "Can you explain recent market trends that affect our unit economics?" },
      { id: "businessInsight-q3", question: "Do you regularly use data to inform your operational decisions?" },
      { id: "businessInsight-q4", question: "How do you link daily actions to broader financial outcomes?" },
      { id: "businessInsight-q5", question: "Can you forecast potential risks and opportunities ahead of time?" }
    ],
    actions: [
      { id: "businessInsight-a1", action: "Review monthly P&L reports and identify at least two cost-saving opportunities." },
      { id: "businessInsight-a2", action: "Attend an industry webinar each quarter to stay current on market shifts." },
      { id: "businessInsight-a3", action: "Build a dashboard to track the top five KPIs for your area weekly." }
    ]
  },
  {
    id: "attractsDevelopsTalent",
    label: "Attracts and Develops Talent",
    questions: [
      { id: "attractsDevelopsTalent-q1", question: "Do you proactively source diverse candidates for open roles?" },
      { id: "attractsDevelopsTalent-q2", question: "How often do you hold career conversations with team members?" },
      { id: "attractsDevelopsTalent-q3", question: "Can you identify high-potential employees and their development needs?" },
      { id: "attractsDevelopsTalent-q4", question: "Do you have a succession plan for critical positions?" },
      { id: "attractsDevelopsTalent-q5", question: "How do you measure the effectiveness of your coaching efforts?" }
    ],
    actions: [
      { id: "attractsDevelopsTalent-a1", action: "Schedule quarterly one-on-one career talks with each direct report." },
      { id: "attractsDevelopsTalent-a2", action: "Create a mentorship buddy system pairing new hires with tenured staff." },
      { id: "attractsDevelopsTalent-a3", action: "Design a 90-day onboarding roadmap for each role to accelerate ramp-up." }
    ]
  },
  {
    id: "beingResilient",
    label: "Being Resilient",
    questions: [
      { id: "beingResilient-q1", question: "How do you respond when targets are missed or plans change suddenly?" },
      { id: "beingResilient-q2", question: "Do you maintain composure under high-pressure situations?" },
      { id: "beingResilient-q3", question: "Can you share a recent setback and what you learned from it?" },
      { id: "beingResilient-q4", question: "What strategies do you use to keep your team motivated during challenges?" },
      { id: "beingResilient-q5", question: "How do you monitor and manage your stress levels?" }
    ],
    actions: [
      { id: "beingResilient-a1", action: "Practice a daily 5-minute mindfulness or breathing exercise." },
      { id: "beingResilient-a2", action: "Conduct after-action reviews to extract lessons from failures." },
      { id: "beingResilient-a3", action: "Build a peer network to share coping tactics and support." }
    ]
  },
  {
    id: "strategicMindset",
    label: "Strategic Mindset",
    questions: [
      { id: "strategicMindset-q1", question: "Do you allocate time each month for long-range planning?" },
      { id: "strategicMindset-q2", question: "Can you articulate how current projects align with the company’s vision?" },
      { id: "strategicMindset-q3", question: "How do you prioritize initiatives with limited resources?" },
      { id: "strategicMindset-q4", question: "Do you regularly scan external factors influencing the strategy?" },
      { id: "strategicMindset-q5", question: "How do you communicate strategic priorities to your team?" }
    ],
    actions: [
      { id: "strategicMindset-a1", action: "Draft a one-page strategy brief outlining objectives, risks, and KPIs." },
      { id: "strategicMindset-a2", action: "Host a quarterly strategy workshop with cross-functional leaders." },
      { id: "strategicMindset-a3", action: "Map each project to strategic pillars and adjust resource allocation." }
    ]
  },
  {
    id: "drivesVisionPurpose",
    label: "Drives Vision and Purpose",
    questions: [
      { id: "drivesVisionPurpose-q1", question: "Can you clearly state our organizational purpose to new hires?" },
      { id: "drivesVisionPurpose-q2", question: "How do you link daily tasks to the broader mission?" },
      { id: "drivesVisionPurpose-q3", question: "Do team members feel inspired by the vision you communicate?" },
      { id: "drivesVisionPurpose-q4", question: "How do you celebrate milestones tied to the vision?" },
      { id: "drivesVisionPurpose-q5", question: "Are you adapting the vision messaging as the business evolves?" }
    ],
    actions: [
      { id: "drivesVisionPurpose-a1", action: "Open meetings with a brief story illustrating the mission in action." },
      { id: "drivesVisionPurpose-a2", action: "Create visual posters showing progress toward long-term goals." },
      { id: "drivesVisionPurpose-a3", action: "Recognize e    mployees who exemplify vision-aligned behaviors monthly." }
    ]
  },
  {
    id: "cultivatesInnovation",
    label: "Cultivates Innovation",
    questions: [
      { id: "cultivatesInnovation-q1", question: "Do you encourage experimentation even if it may fail?" },
      { id: "cultivatesInnovation-q2", question: "How often do you solicit new ideas from frontline staff?" },
      { id: "cultivatesInnovation-q3", question: "Do you allocate budget or time for pilot projects?" },
      { id: "cultivatesInnovation-q4", question: "How do you recognize and reward creative problem solving?" },
      { id: "cultivatesInnovation-q5", question: "Can you name recent innovations implemented in your area?" }
    ],
    actions: [
      { id: "cultivatesInnovation-a1", action: "Launch a monthly 'idea pitch' session with rapid prototyping support." },
      { id: "cultivatesInnovation-a2", action: "Set aside 5% of team time for innovation sprints." },
      { id: "cultivatesInnovation-a3", action: "Share case studies of successful internal innovations in town halls." }
    ]
  },
  {
    id: "drivesResults",
    label: "Drives Results",
    questions: [
      { id: "drivesResults-q1", question: "Do you set clear, measurable goals for every project?" },
      { id: "drivesResults-q2", question: "How do you track progress and course-correct quickly?" },
      { id: "drivesResults-q3", question: "Can you demonstrate a track record of meeting or exceeding targets?" },
      { id: "drivesResults-q4", question: "Do you hold yourself and others accountable for outcomes?" },
      { id: "drivesResults-q5", question: "How do you overcome obstacles that threaten goal achievement?" }
    ],
    actions: [
      { id: "drivesResults-a1", action: "Implement a weekly scoreboard highlighting key performance metrics." },
      { id: "drivesResults-a2", action: "Adopt a 'plan-do-check-act' cycle for every new initiative." },
      { id: "drivesResults-a3", action: "Reward teams that consistently meet stretch goals with recognition events." }
    ]
  },
  {
    id: "situationalAdaptability",
    label: "Situational Adaptability",
    questions: [
      { id: "situationalAdaptability-q1", question: "How quickly do you adjust plans when priorities shift?" },
      { id: "situationalAdaptability-q2", question: "Do you tailor your communication style to different audiences?" },
      { id: "situationalAdaptability-q3", question: "Can you provide an example of successfully navigating ambiguity?" },
      { id: "situationalAdaptability-q4", question: "How do you balance competing demands without losing focus?" },
      { id: "situationalAdaptability-q5", question: "Do you encourage your team to embrace change positively?" }
    ],
    actions: [
      { id: "situationalAdaptability-a1", action: "Run scenario-planning exercises to practice rapid pivots." },
      { id: "situationalAdaptability-a2", action: "Create a decision tree for common operational contingencies." },
      { id: "situationalAdaptability-a3", action: "Share a 'change success story' during team meetings to normalize agility." }
    ]
  },
  {
    id: "courage",
    label: "Courage",
    questions: [
      { id: "courage-q1", question: "Do you speak up about issues even when unpopular?" },
      { id: "courage-q2", question: "How do you handle conflict or pushback constructively?" },
      { id: "courage-q3", question: "Can you recall a time you defended a principle under pressure?" },
      { id: "courage-q4", question: "Do you invite challenging perspectives in discussions?" },
      { id: "courage-q5", question: "How do you create psychological safety for others to be candid?" }
    ],
    actions: [
      { id: "courage-a1", action: "Commit to voicing at least one tough truth in each leadership meeting." },
      { id: "courage-a2", action: "Model constructive dissent by thanking team members who disagree respectfully." },
      { id: "courage-a3", action: "Provide training on assertive communication for your team." }
    ]
  },
  {
    id: "actionOriented",
    label: "Action Oriented",
    questions: [
      { id: "actionOriented-q1", question: "Do you break tasks into quick wins to maintain momentum?" },
      { id: "actionOriented-q2", question: "How quickly do you move from planning to execution?" },
      { id: "actionOriented-q3", question: "Do you avoid analysis paralysis when data is incomplete?" },
      { id: "actionOriented-q4", question: "How do you empower others to take initiative?" },
      { id: "actionOriented-q5", question: "Can you provide an example of decisive action that led to success?" }
    ],
    actions: [
      { id: "actionOriented-a1", action: "Adopt a 24-hour rule: actionable items must start within a day." },
      { id: "actionOriented-a2", action: "Set daily stand-ups focusing on blockers and immediate next steps." },
      { id: "actionOriented-a3", action: "Offer small-scale 'quick win' incentives to spur fast execution." }
    ]
  },
  {
    id: "communicatesEffectively",
    label: "Communicates Effectively",
    questions: [
      { id: "communicatesEffectively-q1", question: "Do you adjust your message for clarity based on audience feedback?" },
      { id: "communicatesEffectively-q2", question: "How often do you verify understanding after giving instructions?" },
      { id: "communicatesEffectively-q3", question: "Do you employ data visualization to reinforce key points?" },
      { id: "communicatesEffectively-q4", question: "Can you balance listening with speaking in conversations?" },
      { id: "communicatesEffectively-q5", question: "How do you adapt communication across cultures or languages?" }
    ],
    actions: [
      { id: "communicatesEffectively-a1", action: "Use the 'teach back' method to confirm comprehension in team briefings." },
      { id: "communicatesEffectively-a2", action: "Attend a public-speaking workshop to refine presentation skills." },
      { id: "communicatesEffectively-a3", action: "Implement a monthly feedback survey on communication effectiveness." }
    ]
  },
  {
    id: "customerFocus",
    label: "Customer Focus",
    questions: [
      { id: "customerFocus-q1", question: "Do you actively gather customer feedback at multiple touchpoints?" },
      { id: "customerFocus-q2", question: "How do you translate customer insights into operational changes?" },
      { id: "customerFocus-q3", question: "Can you cite metrics that track customer satisfaction and loyalty?" },
      { id: "customerFocus-q4", question: "Do frontline staff feel empowered to resolve customer issues?" },
      { id: "customerFocus-q5", question: "How do you anticipate customer needs before they arise?" }
    ],
    actions: [
      { id: "customerFocus-a1", action: "Launch a real-time NPS or SMG dashboard and review results daily." },
      { id: "customerFocus-a2", action: "Create a 'voice of the customer' report shared in weekly ops meetings." },
      { id: "customerFocus-a3", action: "Reward employees who receive outstanding customer praise with spot bonuses." }
    ]
  },
  {
    id: "decisionQuality",
    label: "Decision Quality",
    questions: [
      { id: "decisionQuality-q1", question: "Do you use a structured process when making complex decisions?" },
      { id: "decisionQuality-q2", question: "How often do you review past decisions for learning?" },
      { id: "decisionQuality-q3", question: "Do you balance speed and accuracy under pressure?" },
      { id: "decisionQuality-q4", question: "Can you articulate the rationale behind key decisions to stakeholders?" },
      { id: "decisionQuality-q5", question: "How do you incorporate diverse data sources into decisions?" }
    ],
    actions: [
      { id: "decisionQuality-a1", action: "Adopt a decision matrix template for comparing options with weighted criteria." },
      { id: "decisionQuality-a2", action: "Hold quarterly retrospectives on major decisions to extract best practices." },
      { id: "decisionQuality-a3", action: "Create a 'decision log' documenting assumptions and outcomes." }
    ]
  },
  {
    id: "ensuresAccountability",
    label: "Ensures Accountability",
    questions: [
      { id: "ensuresAccountability-q1", question: "Do you set clear expectations and deadlines for every deliverable?" },
      { id: "ensuresAccountability-q2", question: "How do you track ownership of tasks among team members?" },
      { id: "ensuresAccountability-q3", question: "Do you provide timely feedback when commitments slip?" },
      { id: "ensuresAccountability-q4", question: "Can you describe the consequences for not meeting standards?" },
      { id: "ensuresAccountability-q5", question: "How do you model accountability through your own behavior?" }
    ],
    actions: [
      { id: "ensuresAccountability-a1", action: "Use a RACI chart for all cross-functional projects." },
      { id: "ensuresAccountability-a2", action: "Introduce a public task board showing owners and due dates." },
      { id: "ensuresAccountability-a3", action: "Conduct monthly performance check-ins focused on results vs. commitments." }
    ]
  },
  {
    id: "valuesDifferences",
    label: "Values Differences",
    questions: [
      { id: "valuesDifferences-q1", question: "Do you actively seek input from people with diverse backgrounds?" },
      { id: "valuesDifferences-q2", question: "Can you identify and mitigate unconscious bias in your processes?" },
      { id: "valuesDifferences-q3", question: "How do you ensure inclusive participation in meetings?" },
      { id: "valuesDifferences-q4", question: "Do you recognize and celebrate cultural events in your workplace?" },
      { id: "valuesDifferences-q5", question: "How do you handle conflicts arising from differing perspectives?" }
    ],
    actions: [
      { id: "valuesDifferences-a1", action: "Provide DEI training and track participation metrics." },
      { id: "valuesDifferences-a2", action: "Rotate meeting facilitators to give everyone a voice." },
      { id: "valuesDifferences-a3", action: "Set diversity targets for hiring and promotion decisions." }
    ]
  },
  {
    id: "integrityTrust",
    label: "Integrity and Trust",
    questions: [
      { id: "integrityTrust-q1", question: "Do you consistently follow through on promises and commitments?" },
      { id: "integrityTrust-q2", question: "How transparent are you about decision-making criteria?" },
      { id: "integrityTrust-q3", question: "Do you admit mistakes and correct them quickly?" },
      { id: "integrityTrust-q4", question: "Can team members rely on you to act ethically under pressure?" },
      { id: "integrityTrust-q5", question: "How do you protect confidential information and data privacy?" }
    ],
    actions: [
      { id: "integrityTrust-a1", action: "Publish a personal 'leadership code' outlining your ethical standards." },
      { id: "integrityTrust-a2", action: "Hold a quarterly integrity audit reviewing compliance and ethics incidents." },
      { id: "integrityTrust-a3", action: "Recognize employees who demonstrate honesty, even when costly, in team meetings." }
    ]
  }
];

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "interview-questions",
  tier: "beginner",
  number: "09",
  title: "Interview Questions",
  codename: "INTERVIEW_QUESTIONS",
  blurb:
    "Generates a balanced set of behavioral, technical, and situational interview questions for a given role and seniority.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Interview Designer"],
  inputSchema: [
    {
      key: "role",
      label: "ROLE",
      kind: "text",
      placeholder: "e.g. Senior Product Designer",
    },
    {
      key: "context",
      label: "TEAM_CONTEXT",
      kind: "textarea",
      rows: 4,
      placeholder: "Team mission, stage, key challenges...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      role: "Senior Product Designer (B2B SaaS)",
      context:
        "5-person design team at a Series B platform. Recent challenges: shipping a unified IA across three acquired products, working with a fast-moving PM org.",
    },
    output: `Behavioral
1. Tell me about a redesign you owned across multiple PMs with conflicting priorities.
2. Describe a time you killed a feature you had championed. What changed your mind?
3. How do you handle a peer designer whose taste you disagree with?

Technical / craft
4. Walk me through your IA process for unifying three product surfaces.
5. Show a flow where you had to balance accessibility against visual ambition.
6. What does your design-to-engineering handoff look like at its best?

Situational
7. The PM wants to ship a feature in two weeks; research suggests a different direction. What do you do?
8. A senior engineer pushes back on a pattern you introduced. How does that conversation go?
9. You inherit a design system in poor shape. What ships in your first 30 days?
10. Mid-sprint, you realize the flow has a critical gap. How do you handle the team and the timeline?`,
    log: [
      { tag: "BOOT", text: "Initializing interview_questions.crew" },
      { tag: "STREAM", text: "Mapping role to competency model" },
      { tag: "PROCESS", text: "Drafting 10 questions across 3 buckets" },
      { tag: "OK", text: "Question set generated" },
    ],
  },
  endpoint: "/api/beginner/interview-questions",
};

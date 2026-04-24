import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "job-app-assistant",
  tier: "intermediate",
  number: "05",
  title: "Job Application Assistant",
  codename: "JOB_APP_ASSISTANT",
  blurb:
    "Tailors a resume to a target JD and drafts a matching cover letter, citing the best evidence from the candidate's history.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "PyDantic"],
  pipeline: ["JD Parser", "Resume Tailor", "Cover Letter Writer"],
  inputSchema: [
    {
      key: "jd",
      label: "JOB_DESCRIPTION",
      kind: "textarea",
      rows: 5,
      placeholder: "Paste the JD...",
    },
    {
      key: "resume",
      label: "BASE_RESUME",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste the candidate's master resume...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      jd:
        "Staff PM, Growth at a Series C consumer fintech. Owns activation + retention. Looking for someone who has shipped experiment programs at >5M MAU and rebuilt onboarding from scratch.",
      resume:
        "Anika Rao - PM with 9 years across consumer apps. Led growth at Hopper (12M MAU), shipped 40+ experiments per quarter, redesigned onboarding twice. Earlier roles at Tinder (PM, retention) and Lyft (PM, payments).",
    },
    output: `## Tailored resume highlights
- Shipped 40+ growth experiments per quarter at Hopper (12M MAU) - directly maps to "experiment programs at >5M MAU"
- Led two onboarding rebuilds - lead with the second one (Hopper) since it's larger scale
- Tinder retention work shows the "activation + retention" focus they explicitly named
- De-emphasize Lyft payments role - off-thesis for this JD

## Cover letter

Dear Hiring Team,

When I read your "rebuilt onboarding from scratch" requirement I had to send this in. I've done that twice - the second time at Hopper, where the new flow lifted D7 retention 14% on a 12M-MAU base.

The work you describe is the work I want to keep doing. At Hopper my team ran 40+ growth experiments per quarter on activation and retention, with a strict eval bar (real metric movement, not just stat-sig). Earlier at Tinder I led the retention pod and learned how brutal a consumer comparison can be when activation is cheap.

I'd love to talk about the activation walls a Series C consumer fintech hits and where I think your existing onboarding is leaving the most retention on the table.

Anika`,
    log: [
      { tag: "BOOT", text: "Initializing job_app_assistant.crew" },
      { tag: "STREAM", text: "[1/3] Parsing JD (5 must-haves identified)" },
      { tag: "STREAM", text: "[2/3] Mapping 7 resume bullets to JD requirements" },
      { tag: "PROCESS", text: "[2/3] Reordering bullets for thesis fit" },
      { tag: "STREAM", text: "[3/3] Drafting cover letter" },
      { tag: "OK", text: "Tailored resume + cover letter generated" },
    ],
  },
  endpoint: "/api/intermediate/job-app-assistant",
};

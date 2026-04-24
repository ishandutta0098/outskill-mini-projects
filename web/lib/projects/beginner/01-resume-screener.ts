import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "resume-screener",
  tier: "beginner",
  number: "01",
  title: "Resume Screener",
  codename: "RESUME_SCREENER",
  blurb:
    "A single-agent CrewAI pipeline that scores a candidate resume against a job description and explains its reasoning.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Resume Screener"],
  inputSchema: [
    {
      key: "job_description",
      label: "JOB_DESCRIPTION",
      kind: "textarea",
      rows: 4,
      placeholder: "Paste the JD here...",
    },
    {
      key: "resume",
      label: "RESUME",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste the candidate resume...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      job_description:
        "Senior Backend Engineer (Python). Must-haves: 5+ years Python, FastAPI/Django, PostgreSQL, AWS, distributed systems. Nice-to-haves: Kafka, Kubernetes, observability tooling. Remote, US time zones.",
      resume:
        "Priya Sharma. 6 years backend engineering at fintech startups. Built FastAPI microservices serving 4M req/day on AWS (ECS, RDS Postgres, SQS). Led migration from monolith to event-driven architecture using Kafka. Comfortable with Kubernetes, Terraform, and Datadog dashboards. Based in Bengaluru, open to US-overlap hours.",
    },
    output: `Match score: 9.2 / 10

Strengths
- 6 years Python backend, exceeds the 5-year bar
- Direct FastAPI + Postgres + AWS experience at meaningful scale (4M req/day)
- Hands-on Kafka, Kubernetes, and Datadog cover all "nice-to-have" tooling

Risks
- Time zone: Bengaluru-based, US-overlap is workable but not native
- No explicit mention of distributed transactions or saga patterns

Recommendation
Move to a 45-minute systems-design screen focused on event-driven architecture and consistency tradeoffs.`,
    log: [
      { tag: "BOOT", text: "Initializing resume_screener.crew" },
      { tag: "INFO", text: "Agent: Resume Screener" },
      { tag: "INFO", text: "Task: screen_resume_task" },
      { tag: "STREAM", text: "Parsing job_description (312 chars)" },
      { tag: "STREAM", text: "Parsing resume (487 chars)" },
      { tag: "PROCESS", text: "Scoring against 8 hard requirements" },
      { tag: "OK", text: "Crew kickoff complete in 4.2s" },
    ],
  },
  endpoint: "/api/beginner/resume-screener",
};

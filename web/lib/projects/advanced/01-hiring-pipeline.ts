import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "hiring-pipeline",
  tier: "advanced",
  number: "01",
  title: "Hiring Pipeline",
  codename: "HIRING_PIPELINE",
  blurb:
    "Multi-agent pipeline that ingests a resume, builds a profile, matches it to live roles, and drafts personalized outreach for each match.",
  status: "deployed",
  tags: ["Py_3.12", "CrewAI", "FastAPI", "PyDantic"],
  pipeline: ["Profile Builder", "Job Matcher", "Screening Briefer", "Outreach Writer"],
  inputSchema: [
    {
      key: "resume",
      label: "RESUME_TEXT",
      kind: "textarea",
      rows: 10,
      placeholder: "Paste resume content (or upload via /api endpoint)...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      resume:
        "Karim Haddad - Staff Engineer, 11 years. Currently at Stripe (5y) leading payments orchestration. Earlier at Square (4y) building merchant risk infra. Comfortable with: Go, Java, Spanner, Kafka, distributed transactions. Open to: payments infra, fraud platforms, dev-tools.",
    },
    output: `# Candidate profile
**Karim Haddad** - Staff Engineer (11 yrs)

## Strengths
- Deep payments + risk infra background
- Distributed systems primitives (Spanner, Kafka, Go) at top-tier scale
- Track record at Stripe and Square in adjacent problem spaces

## Best-fit roles
| Company | Role | Match | Notes |
|---|---|---|---|
| Adyen | Staff Eng, Tokenization | 0.92 | Direct payments-infra fit, Spanner overlap |
| Mercury | Staff Eng, Risk Platform | 0.88 | Square-shaped, smaller-scale ICP risk |
| Resend | Staff Eng, Delivery Infra | 0.81 | Stretch - delivery rather than payments |

## Screening brief
Lead with payments-orchestration design. Push on:
- How they reasoned about partial-failure semantics in a multi-PSP flow
- A concrete migration they led where rollback was non-trivial
- Trade-offs between Spanner and a sharded Postgres at their scale

## Outreach drafts

### Adyen
Subject: Tokenization at Adyen - your Stripe orchestration work

Hi Karim,
We're building out the team for tokenization v3 - it's the closest analog at Adyen to what you led at Stripe. Worth 30 minutes to compare notes? - Hira

### Mercury
Subject: Risk platform at Mercury - Square-shaped problems at Series B speed

Hi Karim,
Your Square risk-infra background is exactly the kind of pattern matching we need as we rebuild risk on a smaller, faster substrate. Open to a chat? - Sam`,
    log: [
      { tag: "BOOT", text: "Initializing hiring_pipeline.crew" },
      { tag: "INFO", text: "Agents: Profile Builder | Job Matcher | Briefer | Outreach Writer" },
      { tag: "STREAM", text: "[1/4] Parsing resume - 11 yrs experience extracted" },
      { tag: "PROCESS", text: "[1/4] 4 strength clusters identified" },
      { tag: "STREAM", text: "[2/4] Querying job index (2,400 active roles)" },
      { tag: "PROCESS", text: "[2/4] Top 3 matches above 0.80 threshold" },
      { tag: "STREAM", text: "[3/4] Drafting screening brief" },
      { tag: "STREAM", text: "[4/4] Generating per-match outreach (2 drafts)" },
      { tag: "SUCCESS", text: "Pipeline complete in 12.4s - profile + matches + briefs ready" },
    ],
  },
  endpoint: "/api/advanced/hiring-pipeline",
};

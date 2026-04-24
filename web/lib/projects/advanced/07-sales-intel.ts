import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "sales-intel",
  tier: "advanced",
  number: "07",
  title: "Account Sales Intel",
  codename: "SALES_INTEL",
  blurb:
    "Builds a sales-ready brief on a target account: org chart, recent signals, buying triggers, and entry point.",
  status: "deployed",
  tags: ["Py_3.12", "CrewAI", "BeautifulSoup", "Requests"],
  pipeline: ["Account Profiler", "Signal Hunter", "Brief Writer"],
  inputSchema: [
    {
      key: "account",
      label: "ACCOUNT_NAME",
      kind: "text",
      placeholder: "e.g. Notion",
    },
    {
      key: "thesis",
      label: "OUR_THESIS",
      kind: "textarea",
      rows: 3,
      placeholder: "Why we think they need us in one sentence...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      account: "Loom",
      thesis:
        "As Loom scales transcription + AI features, their inference cost-per-minute is becoming a hard line-item; our streaming feature store cuts that 40-60% in similar workloads.",
    },
    output: `# Account brief: Loom

## Snapshot
- Owner: Atlassian (acq Aug 2023)
- ~250 employees, primary office SF
- Product surface: async video, transcription, AI summary

## Buying triggers (last 90 days)
- Hiring 3 senior infra roles - "platform reliability and cost"
- New AI features (Claude-powered chapters, summary) shipped Mar 2026
- Engineering blog post on transcription cost: signals open conversation

## Decision map
- Likely economic buyer: VP Engineering, Tina Velasquez
- Likely technical champion: Staff Eng, AI Platform - Marco Liu (writes the cost blog)
- Procurement gate: Atlassian shared procurement (slow, but vendor-friendly)

## Entry-point recommendation
Lead with Marco. The cost-per-minute angle is the same one he just published. Suggest a 30-minute "compare notes" call before any pitch deck. Tina's intro should come from Marco, not cold.

## Conversation starters
- "Did you benchmark the inference cost across providers, or only model sizes?"
- "Where does feature retrieval sit on your transcription cost stack today?"
- "If you could shave 40% off the AI line item, where would the team reinvest?"

## Risks
- Atlassian procurement timeline can drag past 5 months
- Internal "build" pull is strong - they have the talent`,
    log: [
      { tag: "BOOT", text: "Initializing sales_intel.crew" },
      { tag: "INFO", text: "Account: Loom" },
      { tag: "STREAM", text: "[1/3] Profiling account (org, ownership, surface)" },
      { tag: "STREAM", text: "[2/3] Hunting signals (LinkedIn jobs, eng blog, releases)" },
      { tag: "PROCESS", text: "[2/3] 3 strong buying triggers detected" },
      { tag: "STREAM", text: "[3/3] Composing brief + entry-point map" },
      { tag: "SUCCESS", text: "Brief generated - lead with technical champion" },
    ],
  },
  endpoint: "/api/advanced/sales-intel",
};

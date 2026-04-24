import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "competitor-intel",
  tier: "intermediate",
  number: "03",
  title: "Competitor Intel",
  codename: "COMPETITOR_INTEL",
  blurb:
    "Crawls a competitor's site and recent posts to produce a structured brief: positioning, pricing, and recent moves.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "BeautifulSoup", "Requests"],
  pipeline: ["Web Scraper", "Brand Analyst", "Brief Writer"],
  inputSchema: [
    {
      key: "company",
      label: "COMPETITOR_NAME",
      kind: "text",
      placeholder: "e.g. Linear",
    },
    {
      key: "url",
      label: "COMPETITOR_URL",
      kind: "text",
      placeholder: "https://...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      company: "FlowGrid",
      url: "https://flowgrid.dev",
    },
    output: `# Competitor brief: FlowGrid

## Positioning
"The fastest way to ship internal tools." Hard pivot toward dev-team buyers in Q1; older marketing copy still targets ops teams.

## Pricing
- Free: 5 apps, 3 editors
- Team: $25 / editor / month
- Business: $60 / editor / month + SSO + audit log
- Enterprise: custom

Removed per-run pricing in March; viewed-app pricing model is gone.

## Product
- Strong: SQL editor, Postgres + Snowflake connectors, Git sync (new in March)
- Weak: charting, mobile, role-based permissions (still in beta)

## Recent moves
- Hired ex-Retool head of design (Jan)
- Open-sourced their workflow runtime (Feb) - taking aim at n8n
- Released a Claude-powered "build with prompt" feature (Apr)

## Where we win
- We have native versioning + branching, they have file-based Git sync only
- Our charting stack is 2 generations ahead

## Where they win
- Connectors breadth (38 vs our 19)
- Brand recognition with infra teams`,
    log: [
      { tag: "BOOT", text: "Initializing competitor_intel.crew" },
      { tag: "INFO", text: "Target: FlowGrid (flowgrid.dev)" },
      { tag: "STREAM", text: "[1/3] Crawling 14 pages" },
      { tag: "PROCESS", text: "[1/3] Extracting pricing + product surfaces" },
      { tag: "STREAM", text: "[2/3] Analyzing positioning shift (Q1 pivot)" },
      { tag: "STREAM", text: "[3/3] Compiling brief" },
      { tag: "OK", text: "Brief generated - 5 sections" },
    ],
  },
  endpoint: "/api/intermediate/competitor-intel",
};

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "seo-blog-pipeline",
  tier: "intermediate",
  number: "01",
  title: "SEO Blog Pipeline",
  codename: "SEO_BLOG_PIPELINE",
  blurb:
    "Three-agent CrewAI pipeline that researches keywords, drafts a blog post, and SEO-optimizes the final copy.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "FastAPI", "BeautifulSoup"],
  pipeline: ["SEO Researcher", "Content Writer", "SEO Optimizer"],
  inputSchema: [
    {
      key: "topic",
      label: "TOPIC",
      kind: "textarea",
      rows: 3,
      placeholder: "Topic / angle for the blog post...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      topic:
        "How small B2B SaaS startups should budget for AI agent infrastructure in 2026",
    },
    output: `# Budgeting for AI agent infrastructure in 2026: a small B2B SaaS guide

## Why this matters now
AI agent infra is no longer a "research line item." For most B2B SaaS startups it is now in the same budget conversation as observability, payments, and email.

## The three real cost buckets
1. Inference - calls to LLMs and embedding models
2. Orchestration - the runtime, queueing, and state store for multi-step agents
3. Observability - traces, evals, and prompt versioning

## A defensible 2026 starting budget
For a Series A B2B SaaS with one production agent feature, plan for $4-8k / month all-in:
- Inference: $1.5-3k (mix of Claude Sonnet + a small model for cheap calls)
- Orchestration: $1-2k (managed) or near zero on a self-hosted runtime
- Observability: $1-2k (traces + LLM-aware logging)

## Where teams overspend
- Defaulting to the largest frontier model for every call
- Storing every full trace forever
- Re-embedding the same content on every deploy

## What to instrument from day one
- Per-feature cost per active user
- Cache hit ratio on retrieval calls
- Eval pass rate by prompt version

## Closing
Treat agent infra like a SaaS line item, not an experiment. Cap it at a percentage of revenue and revisit quarterly.`,
    log: [
      { tag: "BOOT", text: "Initializing seo_blog_pipeline.crew" },
      { tag: "INFO", text: "Agents: SEO Researcher | Content Writer | SEO Optimizer" },
      { tag: "STREAM", text: "[1/3] Researching 12 candidate keywords" },
      { tag: "PROCESS", text: "[1/3] Selected primary keyword: 'AI agent infrastructure budget'" },
      { tag: "STREAM", text: "[2/3] Drafting 7-section outline" },
      { tag: "PROCESS", text: "[2/3] Writing 920-word draft" },
      { tag: "STREAM", text: "[3/3] Optimizing meta + heading hierarchy" },
      { tag: "OK", text: "Pipeline complete in 38.4s" },
    ],
  },
  endpoint: "/api/intermediate/seo-blog-pipeline",
};

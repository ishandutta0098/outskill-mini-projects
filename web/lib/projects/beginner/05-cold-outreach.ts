import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "cold-outreach",
  tier: "beginner",
  number: "05",
  title: "Cold Outreach",
  codename: "COLD_OUTREACH",
  blurb:
    "Generates a short, personalized cold email tying a prospect's role and recent work to your value prop.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Outreach Writer"],
  inputSchema: [
    {
      key: "prospect",
      label: "PROSPECT_BIO",
      kind: "textarea",
      rows: 4,
      placeholder: "Name, title, company, recent activity...",
    },
    {
      key: "product",
      label: "YOUR_PRODUCT",
      kind: "textarea",
      rows: 3,
      placeholder: "One-paragraph product summary + ideal customer...",
    },
  ],
  outputType: "text",
  fixture: {
    input: {
      prospect:
        "Diego Alvarez, VP of Data at FinchPay (mid-market fintech, 200 engineers). Posted last week about scaling realtime fraud features and the cost of feature stores at high QPS.",
      product:
        "We sell a streaming feature store that cuts feature retrieval latency 6x and storage cost 40% vs Feast. Best fit: fintech and adtech with >10k features/sec.",
    },
    output: `Subject: Cutting Feast costs 40% at FinchPay scale

Hi Diego,

Saw your post on the cost curve of feature stores past 10k QPS. Most fintech teams we work with hit the same wall around the same scale.

We built Tide specifically for that part of the stack. Two FinchPay-shaped customers cut p99 retrieval latency 6x and storage cost ~40% vs Feast in their first quarter.

Worth a 20-minute look? Happy to share the architecture diff before you commit any time.

- Alex`,
    log: [
      { tag: "BOOT", text: "Initializing cold_outreach.crew" },
      { tag: "INFO", text: "Agent: Outreach Writer" },
      { tag: "STREAM", text: "Extracting personalization hooks (2 found)" },
      { tag: "PROCESS", text: "Drafting subject + 4 paragraph body" },
      { tag: "OK", text: "Email drafted, 92 words" },
    ],
  },
  endpoint: "/api/beginner/cold-outreach",
};

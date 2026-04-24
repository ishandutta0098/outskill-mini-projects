import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "news-factchecker",
  tier: "advanced",
  number: "02",
  title: "News Fact-Checker",
  codename: "FACT_CHECKER",
  blurb:
    "Decomposes a claim into atomic assertions, retrieves primary sources, and rates each assertion with citations.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "Feedparser", "Requests"],
  pipeline: ["Claim Decomposer", "Source Retriever", "Verdict Synthesizer"],
  inputSchema: [
    {
      key: "claim",
      label: "CLAIM_OR_HEADLINE",
      kind: "textarea",
      rows: 4,
      placeholder: "Paste the claim or headline...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      claim:
        "A study released this week found that remote workers are 40% more productive than office workers and that 90% of Fortune 500 CEOs now support permanent remote work.",
    },
    output: `# Fact-check verdict: MIXED - one assertion overstated, one false

## Atomic assertions
1. "A study this week found remote workers are 40% more productive."
2. "90% of Fortune 500 CEOs now support permanent remote work."

## Assertion 1 - Overstated
The study cited (Stanford Remote Work Lab, Apr 2026) reports a 13% productivity uplift for hybrid workers, not 40%, and explicitly cautions against extrapolation to fully remote.

Source: Stanford Remote Work Lab working paper, Apr 11 2026.

## Assertion 2 - False
A KPMG CEO Outlook survey from Q1 2026 found that 64% of Fortune 500 CEOs prefer in-office or hybrid models, and only 8% explicitly support permanent remote.

Source: KPMG CEO Outlook 2026 Q1 report.

## Combined verdict
The headline is misleading. The productivity figure inflates the actual study finding ~3x, and the CEO support figure is the inverse of the most-cited recent survey.

## Retrieved sources
- Stanford Remote Work Lab, Apr 2026 working paper
- KPMG CEO Outlook 2026 Q1
- Bloomberg coverage of the same study (Apr 12 2026) which correctly reports 13%`,
    log: [
      { tag: "BOOT", text: "Initializing fact_checker.crew" },
      { tag: "STREAM", text: "[1/3] Decomposing claim into 2 atomic assertions" },
      { tag: "STREAM", text: "[2/3] Retrieving 6 candidate sources" },
      { tag: "PROCESS", text: "[2/3] Filtered to 3 primary sources" },
      { tag: "WARN", text: "Assertion 1: cited statistic is 3x the actual study finding" },
      { tag: "WARN", text: "Assertion 2: contradicted by primary source (KPMG Q1 2026)" },
      { tag: "STREAM", text: "[3/3] Synthesizing verdict" },
      { tag: "SUCCESS", text: "Verdict: MIXED - 1 overstated, 1 false" },
    ],
  },
  endpoint: "/api/advanced/news-factchecker",
};

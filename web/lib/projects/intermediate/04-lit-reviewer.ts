import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "lit-reviewer",
  tier: "intermediate",
  number: "04",
  title: "Literature Reviewer",
  codename: "LIT_REVIEWER",
  blurb:
    "Searches recent papers for a research question, clusters findings, and produces a synthesized literature review.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "ArXiv", "Requests"],
  pipeline: ["Paper Finder", "Cluster Analyst", "Reviewer"],
  inputSchema: [
    {
      key: "question",
      label: "RESEARCH_QUESTION",
      kind: "textarea",
      rows: 3,
      placeholder: "Frame as a question, ideally with a time bound...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      question:
        "What is the state of evidence on long-context retrieval for LLMs in 2025-2026? Focus on production-relevant findings.",
    },
    output: `# Literature review: long-context retrieval for LLMs (2025-2026)

## Scope
14 papers reviewed, 9 retained after filtering for production-relevant findings.

## Cluster A: Position-aware retrieval
4 papers converge on the finding that naive top-k retrieval underperforms position-aware retrieval by 8-14% on multi-hop QA, with most of the gain on contexts >32k tokens.

## Cluster B: Cache-augmented inference
3 papers showing that caching intermediate KV states across queries yields 3-5x cost reduction with negligible quality drop, when query similarity exceeds 0.82 cosine.

## Cluster C: Failure modes
2 papers document a "lost-in-the-middle" pattern that worsens nonlinearly past 64k tokens. Mitigation: chunked rerank with overlap >12%.

## Production takeaways
- Start with position-aware retrieval - cheap and consistent win
- KV-cache reuse is the highest-ROI infra change
- Past 64k context, rerank or summarize rather than rely on the model

## Open questions
- No consensus on optimal chunk size for code-heavy contexts
- Long-context evals remain inconsistent across labs`,
    log: [
      { tag: "BOOT", text: "Initializing lit_reviewer.crew" },
      { tag: "STREAM", text: "[1/3] Searching arXiv (14 candidates)" },
      { tag: "PROCESS", text: "[1/3] Filtering for production relevance (9 retained)" },
      { tag: "STREAM", text: "[2/3] Clustering findings into 3 groups" },
      { tag: "STREAM", text: "[3/3] Synthesizing review" },
      { tag: "OK", text: "Review complete - 9 papers, 3 clusters" },
    ],
  },
  endpoint: "/api/intermediate/lit-reviewer",
};

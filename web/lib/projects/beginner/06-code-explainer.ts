import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "code-explainer",
  tier: "beginner",
  number: "06",
  title: "Code Explainer",
  codename: "CODE_EXPLAINER",
  blurb:
    "Explains a code snippet in plain English with intent, control flow, and any non-obvious gotchas highlighted.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Code Explainer"],
  inputSchema: [
    {
      key: "language",
      label: "LANGUAGE",
      kind: "select",
      options: ["python", "typescript", "go", "rust", "java"],
    },
    {
      key: "code",
      label: "SNIPPET",
      kind: "textarea",
      rows: 8,
      placeholder: "Paste the code...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      language: "python",
      code: `def chunk(items, n):
    return [items[i:i+n] for i in range(0, len(items), n)]`,
    },
    output: `Intent
Splits a list into evenly-sized sublists of length n. The last chunk may be shorter if the list does not divide evenly.

How it works
- range(0, len(items), n) walks the start indexes 0, n, 2n, ...
- For each start i, items[i:i+n] is a slice of up to n elements
- The list comprehension collects those slices into a list of lists

Gotchas
- Returns [] if items is empty, not an error
- n must be positive, range will silently produce no indexes if n is 0 or negative which yields []
- For very large lists prefer a generator (yield items[i:i+n]) to avoid building the full result in memory`,
    log: [
      { tag: "BOOT", text: "Initializing code_explainer.crew" },
      { tag: "INFO", text: "Language: python" },
      { tag: "STREAM", text: "Parsing AST (1 function)" },
      { tag: "PROCESS", text: "Drafting intent + flow + gotchas" },
      { tag: "OK", text: "Explanation generated" },
    ],
  },
  endpoint: "/api/beginner/code-explainer",
};

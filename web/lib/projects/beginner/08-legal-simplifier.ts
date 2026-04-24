import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "legal-simplifier",
  tier: "beginner",
  number: "08",
  title: "Legal Simplifier",
  codename: "LEGAL_SIMPLIFIER",
  blurb:
    "Translates a clause from a contract into plain English and surfaces the top three risks for the signing party.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Legal Reader"],
  inputSchema: [
    {
      key: "clause",
      label: "CLAUSE_TEXT",
      kind: "textarea",
      rows: 8,
      placeholder: "Paste the clause...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      clause:
        "The Service Provider shall indemnify, defend, and hold harmless the Customer from and against any and all third-party claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to (a) the Service Provider's breach of this Agreement; (b) any infringement by the Service Provider of any intellectual property right; or (c) the gross negligence or willful misconduct of the Service Provider.",
    },
    output: `Plain English
If the Service Provider messes up - by breaking the contract, infringing on someone's IP, or acting recklessly - they have to cover any third-party lawsuit costs against the Customer, including legal fees.

Top risks for the Service Provider
1. Open-ended dollar exposure. There is no cap on the indemnity.
2. IP infringement is broad - it covers any IP right held by anyone, even unintentional infringement.
3. "Gross negligence or willful misconduct" can be argued aggressively in litigation.

Suggested negotiation
- Add a cap (e.g., 12 months of fees paid)
- Carve out IP infringement caused by Customer-supplied materials
- Tighten the misconduct standard with a "knowingly" qualifier`,
    log: [
      { tag: "BOOT", text: "Initializing legal_simplifier.crew" },
      { tag: "STREAM", text: "Detected clause type: INDEMNIFICATION" },
      { tag: "PROCESS", text: "Mapping legal terms to plain English" },
      { tag: "PROCESS", text: "Scoring 3 risk vectors" },
      { tag: "OK", text: "Clause analysis complete" },
    ],
  },
  endpoint: "/api/beginner/legal-simplifier",
};

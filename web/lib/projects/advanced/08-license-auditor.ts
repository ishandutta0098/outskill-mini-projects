import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "license-auditor",
  tier: "advanced",
  number: "08",
  title: "License Auditor",
  codename: "LICENSE_AUDITOR",
  blurb:
    "Walks a dependency tree, identifies copyleft and source-available risks, and produces a counsel-ready remediation plan.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "Pip-licenses", "Requests"],
  pipeline: ["Tree Walker", "License Classifier", "Remediation Writer"],
  inputSchema: [
    {
      key: "language",
      label: "LANGUAGE",
      kind: "select",
      options: ["python", "javascript", "go", "java"],
    },
    {
      key: "manifest",
      label: "MANIFEST_BODY",
      kind: "textarea",
      rows: 8,
      placeholder: "Paste manifest contents...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      language: "python",
      manifest:
        "fastapi==0.109.2\npyyaml==6.0.1\nfaker==24.0.0\nelasticsearch==8.13.0\nshapely==2.0.4",
    },
    output: `# License audit: 5 direct deps + transitive tree

## High risk
- elasticsearch 8.x - SSPL (source-available, not OSI-approved)
  Action: replace with elasticsearch < 7.11 (Apache-2.0) or migrate to OpenSearch
  Why it matters: SSPL forbids commercial offering as a managed service

## Medium risk
- shapely depends on libgeos (LGPL-2.1)
  Action: distribute libgeos as a shared library, not statically linked
  Why it matters: LGPL relink obligation kicks in only on static linking

## Low risk
- fastapi - MIT
- pyyaml - MIT
- faker - MIT

## Transitive surprises
- 2 transitive deps under MPL-2.0 (file-level copyleft)
  Files modified must be re-licensed under MPL-2.0; net obligation low if you don't fork them.

## Recommended remediation
1. Decision required: keep elasticsearch 8.x and accept SSPL terms, or migrate to OpenSearch
2. Update Dockerfile to dynamically link libgeos
3. Add a license-allowlist check in CI (pip-licenses --fail-on=GPL,SSPL,AGPL)

## Counsel-ready summary
The dependency tree is clean except for one source-available license (elasticsearch SSPL) and one shared-library obligation (libgeos LGPL). Both are remediable in a single sprint without product changes.`,
    log: [
      { tag: "BOOT", text: "Initializing license_auditor.crew" },
      { tag: "INFO", text: "Language: python" },
      { tag: "STREAM", text: "[1/3] Walking dependency tree (5 direct, 47 transitive)" },
      { tag: "STREAM", text: "[2/3] Classifying licenses against policy" },
      { tag: "WARN", text: "[2/3] elasticsearch 8.x is SSPL - high risk" },
      { tag: "WARN", text: "[2/3] libgeos LGPL - medium risk if statically linked" },
      { tag: "STREAM", text: "[3/3] Composing remediation plan" },
      { tag: "SUCCESS", text: "Audit complete - 1 decision required" },
    ],
  },
  endpoint: "/api/advanced/license-auditor",
};

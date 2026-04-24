import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "dep-vuln-scanner",
  tier: "intermediate",
  number: "06",
  title: "Dependency Vuln Scanner",
  codename: "VULN_SCANNER",
  blurb:
    "Scans a manifest for known CVEs, ranks them by exploitability + reachability, and proposes the safest upgrade path.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "Requests", "OSV-API"],
  pipeline: ["Manifest Parser", "CVE Lookup", "Upgrade Planner"],
  inputSchema: [
    {
      key: "manifest_kind",
      label: "MANIFEST_KIND",
      kind: "select",
      options: ["requirements.txt", "package.json", "pom.xml", "go.mod"],
    },
    {
      key: "manifest",
      label: "MANIFEST_BODY",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste the manifest contents...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      manifest_kind: "requirements.txt",
      manifest:
        "fastapi==0.95.0\nrequests==2.28.1\nsqlalchemy==1.4.41\npydantic==1.10.4\npython-multipart==0.0.5",
    },
    output: `# Vulnerability scan: requirements.txt

## Critical
None.

## High
- requests 2.28.1 - CVE-2023-32681 (Proxy-Authorization header leak on cross-origin redirect)
  Upgrade: requests >= 2.31.0
- python-multipart 0.0.5 - CVE-2024-24762 (DoS via crafted boundary)
  Upgrade: python-multipart >= 0.0.7

## Medium
- fastapi 0.95.0 - GHSA-74m5-2c7w-9w3x (request body parsing edge case)
  Upgrade: fastapi >= 0.109.1
- sqlalchemy 1.4.41 - no current CVEs but 1.4 line is in maintenance only
  Suggest: plan migration to 2.0.x

## Low
- pydantic 1.10.4 - no CVEs but 1.x is end-of-life as of 2025
  Suggest: migrate to 2.x in next quarter

## Suggested single-shot upgrade
\`\`\`
fastapi==0.109.2
requests==2.32.3
sqlalchemy==2.0.30
pydantic==2.7.1
python-multipart==0.0.9
\`\`\`
Heads up: pydantic v2 is a breaking change - schedule a migration sprint.`,
    log: [
      { tag: "BOOT", text: "Initializing vuln_scanner.crew" },
      { tag: "INFO", text: "Manifest: requirements.txt (5 deps)" },
      { tag: "STREAM", text: "[1/3] Parsing pinned versions" },
      { tag: "STREAM", text: "[2/3] Querying OSV API" },
      { tag: "PROCESS", text: "[2/3] 4 advisories matched" },
      { tag: "STREAM", text: "[3/3] Computing safe upgrade plan" },
      { tag: "WARN", text: "pydantic 1.x EOL - breaking upgrade required" },
      { tag: "OK", text: "Scan complete" },
    ],
  },
  endpoint: "/api/intermediate/dep-vuln-scanner",
};

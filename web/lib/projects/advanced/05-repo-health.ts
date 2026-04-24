import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "repo-health",
  tier: "advanced",
  number: "05",
  title: "Repo Health Auditor",
  codename: "REPO_HEALTH",
  blurb:
    "Audits a GitHub repo across velocity, contributor health, CI reliability, and review hygiene with a single scorecard.",
  status: "deployed",
  tags: ["Py_3.12", "CrewAI", "Requests", "GitHub-API"],
  pipeline: ["Repo Crawler", "Metric Calculator", "Scorecard Writer"],
  inputSchema: [
    {
      key: "repo",
      label: "REPO",
      kind: "text",
      placeholder: "owner/name",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      repo: "outskill/agent-runtime",
    },
    output: `# Repo health: outskill/agent-runtime

## Overall: B+ (78 / 100)

## Velocity (24 / 25)
- 142 commits in last 30 days (median 4.7 / day)
- Median PR cycle time: 19h (top quartile for repo size)

## Contributor health (16 / 25)
- 8 active maintainers, 22 occasional contributors
- Bus factor: 2 (top 2 contributors merged 64% of code)
- WARN: bus factor below recommended 4

## CI reliability (22 / 25)
- Pass rate: 94.1%
- Median CI duration: 6m 12s
- 3 flaky tests identified - flagged for cleanup

## Review hygiene (16 / 25)
- 88% PRs reviewed before merge
- 12% merged without review (mostly maintainer commits)
- WARN: average review depth = 1.2 reviewers; recommend 2 for security-sensitive paths

## Top fixes
1. Address bus-factor risk: onboard 2 senior contributors as code-owners
2. Quarantine the 3 flaky tests (list in /tests/flaky.md)
3. Require 2 reviewers on /security/* paths via CODEOWNERS

## Strengths to keep
- Excellent PR cycle time
- Healthy contributor inflow (avg 3 new contributors/month)`,
    log: [
      { tag: "BOOT", text: "Initializing repo_health.crew" },
      { tag: "INFO", text: "Target: outskill/agent-runtime" },
      { tag: "STREAM", text: "[1/3] Pulling 30 days of commits + PRs" },
      { tag: "PROCESS", text: "[1/3] 142 commits, 87 PRs analyzed" },
      { tag: "STREAM", text: "[2/3] Computing 4 metric clusters" },
      { tag: "WARN", text: "[2/3] Bus factor = 2 (below recommended 4)" },
      { tag: "STREAM", text: "[3/3] Composing scorecard" },
      { tag: "SUCCESS", text: "Repo health: B+ (78/100)" },
    ],
  },
  endpoint: "/api/advanced/repo-health",
};

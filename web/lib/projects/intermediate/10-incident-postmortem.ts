import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "incident-postmortem",
  tier: "intermediate",
  number: "10",
  title: "Incident Postmortem",
  codename: "POSTMORTEM",
  blurb:
    "Synthesizes incident logs and chat history into a blameless postmortem with a tight timeline and 5-whys analysis.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "Requests"],
  pipeline: ["Log Synthesizer", "Timeline Builder", "5-Whys Analyst"],
  inputSchema: [
    {
      key: "summary",
      label: "INCIDENT_SUMMARY",
      kind: "textarea",
      rows: 3,
      placeholder: "One-paragraph description of the incident...",
    },
    {
      key: "logs",
      label: "LOGS_OR_CHAT",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste raw logs, status posts, or chat threads...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      summary:
        "Webhook deliveries failed for 47 minutes on Apr 14 starting at 14:02 UTC. Customer-visible impact on checkout flows for ~120 customers.",
      logs:
        "14:02 EU webhook worker pool starts returning 504. 14:11 alert fires. 14:18 on-call paged. 14:22 on-call identifies bad deploy from 13:55. 14:31 rollback initiated. 14:48 traffic recovers. Root cause: unbounded retry loop introduced in PR #4421.",
    },
    output: `# Incident postmortem: Webhook delivery outage - Apr 14

## Summary
Webhook deliveries to EU customers failed for 47 minutes starting 14:02 UTC. Estimated 120 customers experienced checkout-flow disruption.

## Timeline (UTC)
- 13:55 PR #4421 deployed to EU pool
- 14:02 EU webhook worker pool returns 504 on all deliveries
- 14:11 SLO alert fires (504 rate >2%)
- 14:18 On-call paged
- 14:22 On-call identifies bad deploy as suspect
- 14:31 Rollback initiated
- 14:48 Traffic recovers, alert clears
- 15:10 Status page updated to RESOLVED

## Impact
- 120 customers experienced webhook delivery failures
- Estimated 4,200 webhook events delayed (median 31 min, max 47 min)
- 9 customers contacted support during window

## Root cause (5-whys)
1. Why did webhooks fail? An unbounded retry loop saturated the worker pool.
2. Why was the loop unbounded? PR #4421 removed the max-attempts cap during a refactor.
3. Why did review miss this? The cap was deleted along with dead code in the same diff.
4. Why was there no test? Retry behavior had unit-only coverage, not an integration test.
5. Why was the alert window 9 minutes? SLO threshold was set conservatively to avoid noise.

## Action items
- [ ] Add integration test for retry caps (owner: payments-infra, due: Apr 21)
- [ ] Lint rule against deleting retry-related constants without explicit annotation (owner: tooling, due: Apr 28)
- [ ] Tighten SLO alert window from 9 to 4 minutes (owner: sre, due: Apr 21)

## What went well
- Rollback was fast (9 minutes from page to recovery start)
- On-call comms in #incidents were clear and timestamped`,
    log: [
      { tag: "BOOT", text: "Initializing postmortem.crew" },
      { tag: "STREAM", text: "[1/3] Synthesizing 14 log lines" },
      { tag: "STREAM", text: "[2/3] Building timeline (8 events)" },
      { tag: "STREAM", text: "[3/3] Running 5-whys analysis" },
      { tag: "OK", text: "Postmortem generated - 3 action items" },
    ],
  },
  endpoint: "/api/intermediate/incident-postmortem",
};

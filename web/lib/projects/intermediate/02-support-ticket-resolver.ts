import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "support-ticket-resolver",
  tier: "intermediate",
  number: "02",
  title: "Support Ticket Resolver",
  codename: "TICKET_RESOLVER",
  blurb:
    "Triages an incoming support ticket: classifies it, drafts a customer reply, and decides whether to escalate.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "FastAPI", "PyDantic"],
  pipeline: ["Triager", "Reply Writer", "Escalation Router"],
  inputSchema: [
    {
      key: "ticket",
      label: "TICKET_BODY",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste the ticket body...",
    },
    {
      key: "tier",
      label: "CUSTOMER_TIER",
      kind: "select",
      options: ["free", "pro", "enterprise"],
    },
  ],
  outputType: "json",
  fixture: {
    input: {
      ticket:
        "Hi - we've had three customers report that webhook deliveries from your API stopped at 14:02 UTC today. Retrying manually returns 504. We're on the Pro plan and this is blocking our checkout flow.",
      tier: "pro",
    },
    output: `{
  "classification": {
    "category": "incident",
    "severity": "high",
    "tags": ["webhooks", "504", "checkout-blocking"]
  },
  "draft_reply": "Hi - thanks for the detailed report. We're seeing elevated 504s on webhook delivery starting 14:02 UTC and have an active incident open (INC-9214). We've isolated the issue to the EU webhook worker pool and are deploying a fix now. ETA to recovery: 20 min. I'll post updates here every 10 min until resolved. Apologies for the disruption to your checkout flow.",
  "escalate": true,
  "route_to": "incident-on-call",
  "sla_remaining_minutes": 30
}`,
    log: [
      { tag: "BOOT", text: "Initializing ticket_resolver.crew" },
      { tag: "INFO", text: "Customer tier: PRO" },
      { tag: "STREAM", text: "[1/3] Classifying ticket" },
      { tag: "PROCESS", text: "[1/3] Severity: HIGH (checkout-blocking)" },
      { tag: "STREAM", text: "[2/3] Drafting customer reply" },
      { tag: "STREAM", text: "[3/3] Routing to incident-on-call" },
      { tag: "OK", text: "Triage complete - SLA 30 min" },
    ],
  },
  endpoint: "/api/intermediate/support-ticket-resolver",
};

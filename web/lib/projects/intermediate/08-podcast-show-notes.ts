import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "podcast-show-notes",
  tier: "intermediate",
  number: "08",
  title: "Podcast Show Notes",
  codename: "SHOW_NOTES",
  blurb:
    "Turns a podcast transcript into structured show notes with timestamped chapters, quotables, and guest links.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "youtube-transcript-api"],
  pipeline: ["Transcript Parser", "Chapter Builder", "Notes Writer"],
  inputSchema: [
    {
      key: "title",
      label: "EPISODE_TITLE",
      kind: "text",
      placeholder: "e.g. Building durable agents in 2026",
    },
    {
      key: "transcript",
      label: "TRANSCRIPT",
      kind: "textarea",
      rows: 8,
      placeholder: "Paste the full transcript with timestamps if available...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      title: "Building durable agents in 2026 with Maya Chen",
      transcript:
        "[00:00] intro... [02:15] guest background, ex-Stripe infra, now founder at Tide... [11:40] why durability beats raw model quality... [24:30] failure modes in long-running agents... [38:00] real story from a midnight outage... [49:10] hiring an agent team in 2026...",
    },
    output: `# Building durable agents in 2026 with Maya Chen

## Summary
A working conversation with Maya Chen, founder of Tide, on why durability is the underrated constraint in production agent systems. Includes a concrete midnight-outage story and how she's hiring against this thesis in 2026.

## Chapters
- 00:00 - Intro
- 02:15 - Maya's background (ex-Stripe infra)
- 11:40 - Why durability beats raw model quality
- 24:30 - Common failure modes in long-running agents
- 38:00 - The midnight outage that changed her thesis
- 49:10 - Hiring an agent team in 2026

## Quotables
- "Most teams optimize for the demo. Durability is what survives Tuesday."
- "If your agent has a 95% success rate, you have a 5% support team."
- "Hiring for agent infra means hiring distributed systems engineers, not ML engineers."

## Links
- Maya on LinkedIn
- Tide
- Stripe Sigma (referenced)
- Paper: 'Reliability is the new accuracy'`,
    log: [
      { tag: "BOOT", text: "Initializing show_notes.crew" },
      { tag: "STREAM", text: "[1/3] Parsing transcript (6 timestamps)" },
      { tag: "STREAM", text: "[2/3] Building chapter list" },
      { tag: "STREAM", text: "[3/3] Pulling 3 quotables + 4 links" },
      { tag: "OK", text: "Show notes generated" },
    ],
  },
  endpoint: "/api/intermediate/podcast-show-notes",
};

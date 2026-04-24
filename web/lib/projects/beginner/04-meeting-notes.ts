import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "meeting-notes",
  tier: "beginner",
  number: "04",
  title: "Meeting Notes",
  codename: "MEETING_NOTES",
  blurb:
    "Turns a raw transcript into a tight summary, decisions list, and a tagged set of action items with owners.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Notes Synthesizer"],
  inputSchema: [
    {
      key: "transcript",
      label: "TRANSCRIPT",
      kind: "textarea",
      rows: 8,
      placeholder: "Paste the meeting transcript...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      transcript:
        "Maya: pricing page bounce is 62%, way too high. Sam: I think the comparison table is the problem - too dense. Maya: agreed. Let's A/B test a simpler version. Sam: I can ship a variant by Wednesday. Priya: should we also revisit the pricing tiers? Maya: yes, but separate workstream. Priya, can you draft a proposal? Priya: by next Monday. Sam: also we still need to fix the mobile checkout bug from last week. Maya: ship that today.",
    },
    output: `Summary
Pricing page bounce is at 62%, suspected cause is the dense comparison table. Team agreed on an A/B test variant, deferring the broader tier review.

Decisions
- A/B test a simplified comparison table
- Treat tier restructuring as a separate workstream
- Mobile checkout bug is top priority, ships today

Action items
- [Sam] Ship simplified comparison variant - Wed
- [Priya] Draft pricing tier proposal - Mon
- [Sam] Patch mobile checkout bug - today`,
    log: [
      { tag: "BOOT", text: "Initializing meeting_notes.crew" },
      { tag: "INFO", text: "Speakers detected: 3" },
      { tag: "STREAM", text: "Extracting 8 utterances" },
      { tag: "PROCESS", text: "Identifying decisions and action items" },
      { tag: "OK", text: "3 decisions, 3 action items extracted" },
    ],
  },
  endpoint: "/api/beginner/meeting-notes",
};

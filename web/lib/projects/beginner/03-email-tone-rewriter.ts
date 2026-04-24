import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "email-tone-rewriter",
  tier: "beginner",
  number: "03",
  title: "Email Tone Rewriter",
  codename: "TONE_REWRITER",
  blurb:
    "Rewrites a draft email in a target tone (professional, friendly, assertive, apologetic) while preserving the underlying ask.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Tone Rewriter"],
  inputSchema: [
    {
      key: "tone",
      label: "TARGET_TONE",
      kind: "select",
      options: ["professional", "friendly", "assertive", "apologetic"],
    },
    {
      key: "draft",
      label: "DRAFT_EMAIL",
      kind: "textarea",
      rows: 6,
      placeholder: "Paste the email draft...",
    },
  ],
  outputType: "text",
  fixture: {
    input: {
      tone: "assertive",
      draft:
        "Hey, sorry to bother you again, but I was kind of hoping you might possibly be able to send the invoice this week if it's not too much trouble. Thanks!",
    },
    output: `Subject: Invoice required this week

Hi,

Following up on the invoice from last week. Please send it by Friday so we can process payment in this billing cycle.

Let me know if anything is blocking on your end.

Thanks,`,
    log: [
      { tag: "BOOT", text: "Initializing tone_rewriter.crew" },
      { tag: "INFO", text: "Target tone: ASSERTIVE" },
      { tag: "STREAM", text: "Stripping hedge phrases (4 detected)" },
      { tag: "PROCESS", text: "Rewriting subject + body" },
      { tag: "OK", text: "Draft rewritten in 2.1s" },
    ],
  },
  endpoint: "/api/beginner/email-tone-rewriter",
};

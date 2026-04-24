import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "social-caption",
  tier: "beginner",
  number: "07",
  title: "Social Caption",
  codename: "SOCIAL_CAPTION",
  blurb:
    "Produces three platform-tailored captions for X, LinkedIn, and Instagram from a single idea or asset description.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Caption Writer"],
  inputSchema: [
    {
      key: "idea",
      label: "IDEA_OR_ASSET",
      kind: "textarea",
      rows: 4,
      placeholder: "Describe the post / image / launch...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      idea:
        "Launch announcement: our open-source agent runtime hit 5,000 GitHub stars in 30 days. Highlight: zero-config local dev, OpenAI + Anthropic + local LLM support.",
    },
    output: `X
5,000 stars in 30 days for our open-source agent runtime.

Zero config, runs locally, swaps OpenAI / Anthropic / local LLMs in one line.

Thank you for the issues, PRs, and the late-night Discord debugging.

LinkedIn
A quiet milestone we did not expect to hit this fast: 5,000 GitHub stars in our first 30 days.

We built the runtime around three opinions:
- Local-first dev should not require a YAML file
- Provider switching should be one line of code
- Streaming should not be an afterthought

Grateful to the maintainers, contributors, and early teams who put it in production. The best part of building in the open is who shows up to help.

Instagram
30 days. 5,000 stars. Zero YAML.

If you've been deep in agent land with us, thank you. If you haven't yet, link in bio.`,
    log: [
      { tag: "BOOT", text: "Initializing social_caption.crew" },
      { tag: "INFO", text: "Targets: X / LinkedIn / Instagram" },
      { tag: "PROCESS", text: "Drafting 3 platform variants" },
      { tag: "OK", text: "3 captions generated" },
    ],
  },
  endpoint: "/api/beginner/social-caption",
};

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "launch-checklist",
  tier: "intermediate",
  number: "07",
  title: "Launch Checklist",
  codename: "LAUNCH_CHECKLIST",
  blurb:
    "Builds a launch-week checklist tailored to a product's stage and channels - eng, marketing, support, and risk.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Stage Profiler", "Checklist Composer"],
  inputSchema: [
    {
      key: "product",
      label: "PRODUCT_CONTEXT",
      kind: "textarea",
      rows: 4,
      placeholder: "What you're launching, audience, channels...",
    },
    {
      key: "stage",
      label: "COMPANY_STAGE",
      kind: "select",
      options: ["pre-launch", "early", "growth", "mature"],
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      product:
        "Launching a Slack-native standup bot with async video clips, paid plan only. Channels: Product Hunt, X, two newsletter sponsorships, dev influencer review.",
      stage: "early",
    },
    output: `# Launch checklist - Slack standup bot

## T-7 days
- [ ] Soft-launch to 30 design partners, collect 3 testimonial quotes
- [ ] Final billing flow QA on iOS + Android Slack clients
- [ ] Onboarding empty state polished
- [ ] Status page live + linked from app footer

## T-2 days
- [ ] Product Hunt teaser asset uploaded
- [ ] Hype thread drafted on X with 6 visuals
- [ ] Newsletter sponsorship proofs approved
- [ ] On-call rotation set for launch day + day-after

## Launch day
- [ ] PH live at 12:01 PT
- [ ] X thread published 30 min after PH live
- [ ] Founder reply-bombs every PH comment within 5 min for first 3 hours
- [ ] Support team monitors #launch-day Slack
- [ ] Hourly metric snapshots: signups, paid conversions, error rate

## Risk register
- Slack Marketplace review can break on launch morning - have a redirect-only fallback ready
- Video clip storage cost will spike - confirm CloudFront budget alarm
- Influencer review may land late - don't let the tweet calendar depend on it

## Day after
- [ ] Post traffic + signup data to X
- [ ] Reply to all PH and X DMs (target: 100% in 24h)
- [ ] Post-launch retro on Friday`,
    log: [
      { tag: "BOOT", text: "Initializing launch_checklist.crew" },
      { tag: "INFO", text: "Stage: EARLY - heavy founder involvement assumed" },
      { tag: "STREAM", text: "[1/2] Profiling channels (4 detected)" },
      { tag: "STREAM", text: "[2/2] Composing 4-section checklist" },
      { tag: "OK", text: "Checklist generated - 22 items, 3 risks" },
    ],
  },
  endpoint: "/api/intermediate/launch-checklist",
};

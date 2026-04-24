import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "startup-validator",
  tier: "beginner",
  number: "10",
  title: "Startup Validator",
  codename: "STARTUP_VALIDATOR",
  blurb:
    "Pressure-tests a startup idea: who it's for, what it replaces, what kills it, and a candid go / no-go score.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Idea Validator"],
  inputSchema: [
    {
      key: "idea",
      label: "STARTUP_IDEA",
      kind: "textarea",
      rows: 6,
      placeholder: "Describe the idea, target user, and how you'd make money...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      idea:
        "A subscription product that gives indie devs a single API for sending email, SMS, and push, with usage-based pricing under Twilio's. Target: solo founders and small teams shipping side-projects.",
    },
    output: `Validation summary

Who it is for
Indie devs and 1-3 person teams who currently glue Mailgun + Twilio + OneSignal together for side projects.

Replaces
- Mailgun, Postmark, Resend (transactional email)
- Twilio (SMS)
- OneSignal, Pusher (push)

What kills it
- Twilio Segment / SendGrid bundle pricing for the mid-market
- Resend's developer mindshare in transactional email
- Channel-specific reliability is brutal at low volume

Score: 5.5 / 10
Real pain, but the wedge is thin. The strongest version is "Stripe for messaging" - one SDK, one bill, generous free tier - and pricing pressure from incumbents will be constant.

Next step
Validate by talking to 20 indie devs about whether they would switch from Resend if SMS and push were free up to 1k/month.`,
    log: [
      { tag: "BOOT", text: "Initializing startup_validator.crew" },
      { tag: "STREAM", text: "Identifying target user + replaced products" },
      { tag: "PROCESS", text: "Stress-testing 4 failure modes" },
      { tag: "PROCESS", text: "Scoring on 6-axis rubric" },
      { tag: "OK", text: "Validation complete - score 5.5" },
    ],
  },
  endpoint: "/api/beginner/startup-validator",
};

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "content-repurposer",
  tier: "advanced",
  number: "09",
  title: "Content Repurposer",
  codename: "CONTENT_REPURPOSER",
  blurb:
    "Takes one long-form post and produces a tweet thread, a LinkedIn essay, and a 60-second video script - same thesis, native voice each.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "Markdown"],
  pipeline: ["Thesis Extractor", "Channel Adapter", "Voice Tuner"],
  inputSchema: [
    {
      key: "post",
      label: "SOURCE_POST",
      kind: "textarea",
      rows: 10,
      placeholder: "Paste the source blog post or essay...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      post:
        "Why durability is the new accuracy in production agents. Most agent demos look great until Tuesday. The bottleneck isn't the model, it's the runtime. We rewrote our orchestration layer around durable steps and crashed-process recovery, and the production failure rate dropped 84%...",
    },
    output: `## Tweet thread (6 tweets)

1/ "Demo-quality agents" is a trap.

The hardest part of running agents in production isn't model accuracy.

It's making them survive Tuesday.

2/ We had a 92% pass rate in eval and a 14% retry rate in prod.

Same model. Same prompts. Different bottleneck.

3/ The bottleneck was the runtime.

Long-running steps. Network blips. Machine restarts. None of which the model has any control over.

4/ We rewrote orchestration around two ideas:
- Every step is durable
- Every crash recovers from the last successful step

5/ Production failure rate dropped 84%.

Same model. Same prompts. Real-world success up the way evals couldn't predict.

6/ Durability is the new accuracy.

If you're shipping agents in 2026, the runtime is your model.

## LinkedIn essay (4 paragraphs)

Most agent demos are misleading. They optimize for the moment of the keynote, not the moment of the production rollout.

We learned this the hard way. Our internal evals showed 92% pass rate. Production showed 14% retries. The model wasn't the problem - the runtime was.

We rewrote orchestration around durable steps and crash-process recovery. No more in-memory state mid-flight. Every step writes its result before the next one starts. When a worker dies, the agent picks up where it left off, not where the demo started.

The result was an 84% drop in production failure rate. Same model. Same prompts. The lesson: in 2026, the runtime is your model. If you are not investing in durability, you are paying for it in support tickets.

## 60-second video script

[0:00] Most agent demos lie.
[0:04] Not on purpose. They just measure the wrong thing.
[0:09] We had 92% accuracy in eval and 14% retries in prod. Same model. Same prompts.
[0:18] The bottleneck wasn't the model. It was the runtime.
[0:24] Network blips. Machine restarts. Long-running steps that died on minute 11 of 12.
[0:32] So we rewrote orchestration. Every step is durable. Every crash recovers from the last good step.
[0:42] Production failure rate dropped 84%.
[0:48] In 2026, the runtime is your model.
[0:54] If you are not investing in durability, you are paying for it in support tickets.`,
    log: [
      { tag: "BOOT", text: "Initializing content_repurposer.crew" },
      { tag: "STREAM", text: "[1/3] Extracting core thesis (1 detected)" },
      { tag: "STREAM", text: "[2/3] Adapting to 3 channels: X, LinkedIn, video" },
      { tag: "STREAM", text: "[3/3] Tuning voice per channel" },
      { tag: "SUCCESS", text: "3 channel-native variants generated" },
    ],
  },
  endpoint: "/api/advanced/content-repurposer",
};

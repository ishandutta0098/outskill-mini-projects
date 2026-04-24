import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "hate-speech-detector",
  tier: "beginner",
  number: "00",
  title: "Hate Speech Detector",
  codename: "HATE_SPEECH",
  blurb:
    "A single-agent CrewAI pipeline that analyzes text for hate speech or offensive language, classifying it with confidence and reasoning.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenRouter"],
  pipeline: ["Hate Speech Detector"],
  inputSchema: [
    {
      key: "text",
      label: "TEXT_INPUT",
      kind: "textarea",
      rows: 4,
      placeholder: "Paste or type the text to analyze for hate speech...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      text: "People from that race are all untrustworthy and should not be allowed to work in public jobs.",
    },
    output: `- Classification: Hate speech
- Confidence: High
- Targeted group: Race
- Key phrases that influenced the decision: "untrustworthy," "should not be allowed to work in public jobs"
- Brief reasoning: The text contains clear hate speech, as it targets individuals based on race by labeling them as "untrustworthy" and advocating for their exclusion from public employment. Such generalizations and calls for discriminatory practices based on racial attributes promote hatred and reinforce harmful stereotypes.`,
    log: [
      { tag: "BOOT", text: "Initializing hate_speech_detector.crew" },
      { tag: "INFO", text: "Agent: Hate Speech Detector" },
      { tag: "INFO", text: "Role: Analyze text and identify hate speech / offensive language" },
      { tag: "INFO", text: "LLM: openai/gpt-4o via OpenRouter" },
      { tag: "STREAM", text: "Receiving input text (94 chars)" },
      { tag: "PROCESS", text: "Step 1: Reading text carefully" },
      { tag: "PROCESS", text: "Step 2: Identifying language targeting groups based on race, ethnicity, gender..." },
      { tag: "PROCESS", text: "Step 3: Checking for threats, dehumanizing language, insults" },
      { tag: "PROCESS", text: "Step 4: Evaluating context" },
      { tag: "PROCESS", text: "Step 5: Making objective classification decision" },
      { tag: "OK", text: "Classification complete — hate speech detected" },
      { tag: "SUCCESS", text: "[HATE_SPEECH] pipeline finished in 3.1s" },
    ],
  },
  endpoint: "/api/beginner/hate-speech-detector",
};

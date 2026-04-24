import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "review-sentiment",
  tier: "beginner",
  number: "02",
  title: "Review Sentiment",
  codename: "REVIEW_SENTIMENT",
  blurb:
    "Classifies a customer review into positive, negative, or mixed and returns the top theme behind the sentiment.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenAI"],
  pipeline: ["Sentiment Analyst"],
  inputSchema: [
    {
      key: "review",
      label: "REVIEW_TEXT",
      kind: "textarea",
      rows: 5,
      placeholder: "Paste the customer review...",
    },
  ],
  outputType: "json",
  fixture: {
    input: {
      review:
        "The build quality is fantastic and the battery easily lasts two days. But the companion app is buggy and crashed three times in a week. Would still recommend if you can stomach the software.",
    },
    output: `{
  "sentiment": "mixed",
  "score": 0.42,
  "themes": {
    "positive": ["build quality", "battery life"],
    "negative": ["companion app stability"]
  },
  "summary": "Positive on hardware, negative on software. Net-positive recommendation."
}`,
    log: [
      { tag: "BOOT", text: "Initializing review_sentiment.crew" },
      { tag: "INFO", text: "Agent: Sentiment Analyst" },
      { tag: "STREAM", text: "Tokenizing 38 words" },
      { tag: "PROCESS", text: "Extracting 3 candidate themes" },
      { tag: "OK", text: "Sentiment classified as MIXED (0.42)" },
    ],
  },
  endpoint: "/api/beginner/review-sentiment",
};

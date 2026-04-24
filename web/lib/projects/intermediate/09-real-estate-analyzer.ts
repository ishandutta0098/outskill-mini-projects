import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "real-estate-analyzer",
  tier: "intermediate",
  number: "09",
  title: "Real Estate Analyzer",
  codename: "REAL_ESTATE",
  blurb:
    "Pulls comparables and recent sales for an address and produces a price-band estimate with confidence intervals.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "Requests", "Open-Data"],
  pipeline: ["Address Resolver", "Comp Finder", "Valuation Writer"],
  inputSchema: [
    {
      key: "address",
      label: "ADDRESS",
      kind: "text",
      placeholder: "Street, city, state",
    },
    {
      key: "intent",
      label: "INTENT",
      kind: "select",
      options: ["buy", "sell", "rent"],
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      address: "742 Cedar Ave, Austin TX",
      intent: "buy",
    },
    output: `# 742 Cedar Ave, Austin TX

## Estimate
Price band: $612k - $678k
Midpoint: $645k
Confidence: medium (8 strong comps, 2 weak)

## Comparable sales (last 90 days)
- 716 Cedar Ave - 4bd / 2ba / 1,820 sqft - sold $638k (28 days ago)
- 812 Birch Ln - 3bd / 2ba / 1,690 sqft - sold $598k (45 days ago)
- 740 Cedar Ave - 4bd / 2.5ba / 1,940 sqft - sold $672k (61 days ago)

## Market signals
- Median time on market in this zip: 34 days (down 11% YoY)
- Sale-to-list ratio: 99.2% (slight buyer's market correction)
- New listings up 14% MoM

## Negotiation guidance
At asking $665k, expect 0-3% room. Push back on:
- HVAC age (12+ years per listing)
- No solar credit despite recent reroof

## Risks
- Property tax assessment likely to reset on sale
- Flood zone X (low) but adjacent to AE - check insurance quote before close`,
    log: [
      { tag: "BOOT", text: "Initializing real_estate.crew" },
      { tag: "INFO", text: "Intent: BUY" },
      { tag: "STREAM", text: "[1/3] Geocoding address" },
      { tag: "STREAM", text: "[2/3] Pulling 12 candidate comps" },
      { tag: "PROCESS", text: "[2/3] 8 strong + 2 weak comps retained" },
      { tag: "STREAM", text: "[3/3] Composing valuation" },
      { tag: "OK", text: "Estimate complete - confidence MEDIUM" },
    ],
  },
  endpoint: "/api/intermediate/real-estate-analyzer",
};

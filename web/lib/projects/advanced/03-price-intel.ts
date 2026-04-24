import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "price-intel",
  tier: "advanced",
  number: "03",
  title: "Price Intelligence",
  codename: "PRICE_INTEL",
  blurb:
    "Tracks a product's price across competitors, detects pricing anomalies, and recommends a positioning move.",
  status: "deployed",
  tags: ["Py_3.12", "CrewAI", "BeautifulSoup", "Requests-Cache"],
  pipeline: ["Crawler", "Anomaly Detector", "Strategy Writer"],
  inputSchema: [
    {
      key: "product",
      label: "PRODUCT",
      kind: "text",
      placeholder: "Product name or SKU",
    },
    {
      key: "competitors",
      label: "COMPETITOR_URLS",
      kind: "textarea",
      rows: 4,
      placeholder: "One competitor URL per line...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      product: "Aero-Lite Standing Desk 60in (Walnut)",
      competitors:
        "https://branch.com/desks/standing\nhttps://uplift.com/standing-desks\nhttps://fully.com/standing-desks",
    },
    output: `# Price intelligence: Aero-Lite Standing Desk 60in

## Current pricing snapshot
| Source | Price | Notes |
|---|---|---|
| Our store | $749 | List, no active promo |
| Branch | $689 | -8% vs us, includes free mat |
| UPLIFT V2 60in | $899 | Premium-positioned, 7-yr warranty |
| Fully Jarvis 60in | $719 | Slight undercut, 30% slower ship |

## Anomaly detected
Branch dropped price by $60 in the last 7 days; this is the third drop this quarter for the same SKU. Likely an inventory clear ahead of a Q3 model.

## Positioning recommendation
Hold list at $749 but ship a $25 accessory credit through end of month, framed as a "load-out bundle." This protects margin while neutralizing the headline price gap with Branch.

## Risks
- If Branch's clear is followed by a new SKU at $649, expect 4-6 weeks of price pressure
- UPLIFT's 7-year warranty narrative is still our biggest non-price disadvantage

## What to watch
- Branch listing for the next SKU drop
- UPLIFT promo cadence (typically a Q3 sale)
- Fully shipping times - currently 12-16 days vs our 5`,
    log: [
      { tag: "BOOT", text: "Initializing price_intel.crew" },
      { tag: "INFO", text: "SKU: Aero-Lite 60in Walnut" },
      { tag: "STREAM", text: "[1/3] Crawling 3 competitor pages" },
      { tag: "PROCESS", text: "[1/3] Prices extracted, 30-day series loaded" },
      { tag: "STREAM", text: "[2/3] Running anomaly detection" },
      { tag: "WARN", text: "[2/3] Branch: 3rd price drop in quarter detected" },
      { tag: "STREAM", text: "[3/3] Drafting positioning recommendation" },
      { tag: "SUCCESS", text: "Strategy issued: hold list, $25 accessory credit" },
    ],
  },
  endpoint: "/api/advanced/price-intel",
};

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "crypto-advisor",
  tier: "advanced",
  number: "04",
  title: "Crypto Portfolio Advisor",
  codename: "CRYPTO_ADVISOR",
  blurb:
    "Reads a portfolio, scores concentration risk, and recommends rebalancing moves with target weights and rationale.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "PyCoinGecko"],
  pipeline: ["Portfolio Reader", "Risk Analyst", "Rebalance Planner"],
  inputSchema: [
    {
      key: "portfolio",
      label: "PORTFOLIO_HOLDINGS",
      kind: "textarea",
      rows: 6,
      placeholder: "ASSET, AMOUNT per line (e.g. BTC, 0.85)",
    },
    {
      key: "risk_profile",
      label: "RISK_PROFILE",
      kind: "select",
      options: ["conservative", "balanced", "aggressive"],
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      portfolio: "BTC, 0.85\nETH, 12.4\nSOL, 320\nLINK, 1500",
      risk_profile: "balanced",
    },
    output: `# Portfolio rebalance - balanced profile

## Current state
| Asset | Amount | USD value | Weight |
|---|---|---|---|
| BTC | 0.85 | $58,200 | 41% |
| ETH | 12.4 | $43,400 | 30% |
| SOL | 320 | $32,800 | 23% |
| LINK | 1,500 | $9,150 | 6% |
| **Total** | | **$143,550** | 100% |

## Risk read
- Concentration: HEALTHY (no single asset above 45%)
- Tail risk: ELEVATED on SOL (correlation to BTC has loosened in last 60 days)
- Stables: 0% allocation - high for "balanced"

## Recommended target (balanced)
| Asset | Target weight | Action |
|---|---|---|
| BTC | 38% | Trim 3% |
| ETH | 28% | Trim 2% |
| SOL | 14% | Trim 9% |
| LINK | 5% | Trim 1% |
| Stables (USDC) | 15% | Add |

## Suggested moves
1. Sell 0.07 BTC -> USDC (~$4,800)
2. Sell 0.8 ETH -> USDC (~$2,800)
3. Sell 130 SOL -> USDC (~$13,300)
4. Hold LINK at 5%

## Rationale
The balanced sleeve historically benefits from a 10-20% stables float for re-entry on drawdowns. Trimming SOL most aggressively addresses the elevated tail risk in the current correlation regime.

## Disclosures
This is informational only and not investment advice. Re-run after confirming live prices.`,
    log: [
      { tag: "BOOT", text: "Initializing crypto_advisor.crew" },
      { tag: "INFO", text: "Risk profile: BALANCED" },
      { tag: "STREAM", text: "[1/3] Pricing 4 holdings via CoinGecko" },
      { tag: "STREAM", text: "[2/3] Computing concentration + tail-risk metrics" },
      { tag: "WARN", text: "[2/3] SOL tail-risk ELEVATED (60-day correlation drift)" },
      { tag: "STREAM", text: "[3/3] Solving rebalance for balanced target" },
      { tag: "SUCCESS", text: "Rebalance plan issued - 4 trades" },
    ],
  },
  endpoint: "/api/advanced/crypto-advisor",
};

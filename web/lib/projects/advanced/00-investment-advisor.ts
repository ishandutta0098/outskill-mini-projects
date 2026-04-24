import type { LogLine, ProjectDef } from "../schema";

export type ToolCall = {
  tool: string;
  input: string;
  output: string;
};

export type AgentOutput = {
  agent: string;
  output: string;
  tools: ToolCall[];
  context?: string[];
};

export type Recommendation = {
  action: "BUY" | "HOLD" | "SELL";
  confidence: number;
  target_price: number;
  current_price: number;
  reasons: string[];
  risks: string[];
};

export type StockFixture = {
  symbol: string;
  agentOutputs: AgentOutput[];
  recommendation: Recommendation;
  log: LogLine[];
};

function makeStockLog(symbol: string, agentName: string, agentNum: number, detail: string): LogLine[] {
  return [
    { tag: "BOOT", text: `[${symbol}] Initializing ${agentName} (Agent ${agentNum}/4)` },
    { tag: "INFO", text: `[${symbol}] ${agentName} — processing ${symbol} data` },
    { tag: "PROCESS", text: `[${symbol}] ${agentName} — ${detail}` },
    { tag: "OK", text: `[${symbol}] ${agentName} — output ready` },
  ];
}

const AAPL_FINANCIAL_ANALYSIS = `Comprehensive Analysis of Apple Inc. (AAPL) – Financial Health, Stock Valuation, Risks, and Latest News as of 2026

1. Financial Health

Apple Inc. remains an exceptionally strong company from a financial perspective.

- Revenue & Profitability: Apple's total revenue for the latest fiscal year (2023) stood at $383.3 billion, slightly down from the 2022 peak of $394.3 billion. Despite this minor decline, gross profit margins are strong and have improved (47.33%). Net income remains robust at $94.1 billion in 2023.
- EBITDA & Operating Performance: EBITDA is at an impressive $152.9 billion, underlining the healthy, cash-generative nature of Apple's operations.
- Balance Sheet Strength: Apple's massive cash flows, recurring revenue streams, and market capitalization (~$3.98 trillion) suggest unparalleled access to liquidity.

2. Stock Valuation

- EPS & P/E Ratio: With an EPS of $7.9 and a current stock price of $271.06, Apple's P/E ratio stands at 34.31.
- Market Cap: At nearly $4 trillion, Apple is the world's most valuable public company.
- Stock Price Range: Current price of $271.06 is near the 52-week high ($288.62), well above the 52-week low ($193.25).

3. Risks

- AI Transition & Innovation Pressure: Apple's perceived lag in generative AI compared to rivals is a central risk.
- Execution in Leadership Transition: The handover from Tim Cook to John Ternus carries execution risk.
- Valuation Risk: A P/E in the mid-30s leaves little margin for error.

4. Latest News

- Leadership Transition: Tim Cook's move to Executive Chairman with John Ternus becoming CEO.
- AI Focus & Silicon Leadership: Heavy investment in proprietary silicon and AI-optimized chips.
- New Business Platform: Launch of "Apple Business" marks expansion into enterprise services.
- Strong Q1 2026 Results: Double-digit growth in services and wearables.`;

const AAPL_NEWS = `Latest News Summary for Apple Inc. (AAPL) — April 2026

1. CEO Transition: Tim Cook has transitioned to Executive Chairman, with John Ternus appointed as CEO. Ternus brings deep hardware engineering expertise and an "uncompromising approach to quality."

2. AI Strategy Under Scrutiny: Multiple analysts highlight Apple's need to accelerate its generative AI offerings. The April 2026 product event introduced AI features that were seen as evolutionary rather than revolutionary. Privacy-centric on-device AI remains Apple's differentiator.

3. Apple Business Launch: A new enterprise-focused subscription and device management platform, marking Apple's deeper push into recurring B2B revenue streams.

4. US Manufacturing Expansion: Mac mini production augmented in the US, strengthening supply chain resilience.

5. Q1 FY2026 Earnings: Strong results with double-digit growth in services and wearables. Subscription revenues continue to rise. Emerging market sales notably strong.

6. Custom Silicon Progress: Johny Srouji's team advancing AI-optimized chips for future devices, positioning Apple for on-device intelligence leadership.`;

const AAPL_ANALYSIS = `Consolidated Analysis — Apple Inc. (AAPL)

Financial Health: STRONG
Apple demonstrates exceptional financial health with $383.3B revenue, $94.1B net income, and $152.9B EBITDA. Gross margins at 47.33% reflect premium pricing power. Market cap approaching $4T with fortress balance sheet.

Valuation Assessment: PREMIUM
Trading at P/E 34.31 with stock at $271.06 (near 52-week high of $288.62). Premium valuation prices in growth expectations from AI, services expansion, and custom silicon. Limited margin for disappointment.

Growth Catalysts:
1. Services & subscription revenue growing double-digits
2. Apple Business enterprise platform (new recurring revenue)
3. Custom AI-optimized silicon pipeline
4. Emerging market expansion driving iPhone/Mac volumes

Risk Factors:
1. AI strategy perceived as lagging vs Microsoft, Google, OpenAI
2. CEO transition execution risk (Cook → Ternus)
3. High valuation sensitive to earnings misses
4. Rising R&D and manufacturing costs

News Sentiment: CAUTIOUSLY OPTIMISTIC
Leadership transition is orderly but adds uncertainty. AI catch-up narrative is the dominant theme. Strong Q1 results provide near-term confidence. Enterprise expansion via Apple Business opens new TAM.

Overall Assessment: Apple remains a financial powerhouse entering a pivotal period. The stock's premium valuation demands flawless execution on AI strategy and enterprise growth under new leadership.`;

const GOOGL_FINANCIAL_ANALYSIS = `Consolidated Analysis — Alphabet Inc. (GOOGL)

Financial Health: VERY STRONG
Alphabet reported $350.0B in revenue for FY2025, up 14% YoY. Operating income reached $112.4B with operating margins at 32.1%. Google Cloud crossed $50B annual revenue run-rate with improving margins. Cash and equivalents stand at $118.3B.

Valuation Assessment: REASONABLE GROWTH PREMIUM
Trading at P/E 24.8 with stock at $192.40. Valuation reflects AI leadership position and cloud growth acceleration. More reasonable than mega-cap peers given growth trajectory.

Growth Catalysts:
1. Gemini AI integration across Search, Workspace, and Cloud driving monetization
2. Google Cloud revenue accelerating with AI workload demand
3. YouTube premium subscriptions surpassing 120M globally
4. Waymo autonomous driving approaching commercial scale

Risk Factors:
1. Antitrust proceedings and potential search remedies
2. AI compute infrastructure costs compressing margins near-term
3. Competition from OpenAI/Microsoft in enterprise AI
4. Ad market sensitivity to economic cycles

News Sentiment: BULLISH
Gemini 2.5 launch received strong developer reception. Cloud customer wins accelerating. Waymo expansion to 10 new cities announced. YouTube TV subscriber growth exceeding expectations.

Overall Assessment: Alphabet is uniquely positioned at the intersection of AI innovation and proven advertising monetization. Cloud momentum and Gemini integration provide multiple growth vectors.`;

const GOOGL_NEWS = `Latest News Summary for Alphabet Inc. (GOOGL) — April 2026

1. Gemini 2.5 Launch: Alphabet released Gemini 2.5 with significant improvements in reasoning and multimodal capabilities. Strong developer adoption across Google Cloud Platform.

2. Cloud Revenue Milestone: Google Cloud surpassed $50B annual run-rate revenue, with AI-specific workloads driving 40% of new deals.

3. Antitrust Update: DOJ antitrust case continues with potential search remedies under discussion. Market has largely priced in moderate outcomes.

4. Waymo Expansion: Autonomous ride-hailing service expanding to 10 new US cities, with paid rides exceeding 200K per week.

5. YouTube Growth: YouTube premium subscriptions surpassed 120M globally. YouTube TV approaching 10M subscribers.

6. AI Infrastructure Investment: $45B capex planned for 2026, focused on AI training clusters and data centers.`;

const GOOGL_ANALYSIS = `Comprehensive Financial Analysis — Alphabet Inc. (GOOGL)

Revenue: $350.0B (FY2025, +14% YoY)
Operating Income: $112.4B (margin: 32.1%)
Cash Position: $118.3B
EPS: $8.72 | P/E: 24.8 | Stock: $192.40

Key Strengths:
- AI leadership through Gemini integration across product suite
- Google Cloud inflection point with AI workload demand
- Diversified revenue beyond advertising (Cloud, YouTube, Hardware)
- Massive cash reserves enabling aggressive R&D investment

Key Concerns:
- Antitrust risk remains an overhang
- $45B capex may pressure free cash flow near-term
- Competition intensifying in enterprise AI from Microsoft/OpenAI
- Ad revenue still represents ~75% of total revenue

Conclusion: Alphabet represents one of the strongest risk-reward profiles in mega-cap tech, with proven AI execution and improving business diversification.`;

const MSFT_FINANCIAL_ANALYSIS = `Consolidated Analysis — Microsoft Corporation (MSFT)

Financial Health: EXCEPTIONAL
Microsoft reported $262.5B in revenue for FY2025, up 16% YoY. Operating income hit $119.8B with industry-leading margins at 45.6%. Azure revenue grew 31% YoY. Free cash flow reached $78.2B.

Valuation Assessment: PREMIUM BUT JUSTIFIED
Trading at P/E 35.2 with stock at $478.30. Premium valuation reflects AI monetization leadership through Copilot and Azure OpenAI Service. Highest margins among hyperscalers.

Growth Catalysts:
1. Microsoft 365 Copilot adoption exceeding initial expectations with 60% enterprise penetration
2. Azure growth sustained at 31% driven by AI workloads
3. GitHub Copilot surpassing 5M paid subscribers
4. Gaming segment stabilizing post-Activision integration

Risk Factors:
1. High valuation leaves limited room for misexecution
2. Enterprise AI spending could face budget scrutiny
3. Regulatory concerns around AI market dominance
4. Integration execution across rapidly expanding product portfolio

News Sentiment: STRONGLY BULLISH
Copilot revenue exceeding Street estimates. Azure AI services winning major enterprise contracts. LinkedIn AI features driving engagement growth. Gaming Game Pass subscribers up 25%.

Overall Assessment: Microsoft has established the most comprehensive AI monetization strategy in tech. Azure + Copilot + OpenAI partnership creates a compounding flywheel that justifies premium valuation.`;

const MSFT_NEWS = `Latest News Summary for Microsoft Corporation (MSFT) — April 2026

1. Copilot Revenue Beat: Microsoft 365 Copilot achieving higher-than-expected ARPU with 60% Fortune 500 adoption. Analysts project Copilot as a $10B+ annual revenue stream by FY2027.

2. Azure Growth: Azure cloud revenue grew 31% YoY, with AI services representing the fastest-growing segment. Major wins include multi-year contracts with three Fortune 100 companies.

3. GitHub Copilot Milestone: Surpassed 5M paid subscribers, becoming the leading AI-powered developer tool globally.

4. OpenAI Partnership: Deepened integration with OpenAI's latest models across Azure, providing exclusive enterprise access to advanced reasoning capabilities.

5. Gaming: Game Pass subscribers grew 25% YoY post-Activision integration. Call of Duty and Starfield driving engagement.

6. LinkedIn AI: New AI-powered recruiting and learning features driving record engagement metrics.`;

const MSFT_ANALYSIS = `Comprehensive Financial Analysis — Microsoft Corporation (MSFT)

Revenue: $262.5B (FY2025, +16% YoY)
Operating Income: $119.8B (margin: 45.6%)
Free Cash Flow: $78.2B
EPS: $13.58 | P/E: 35.2 | Stock: $478.30

Key Strengths:
- Industry-leading AI monetization through Copilot ecosystem
- Azure cloud growth sustained at 31% with AI acceleration
- Highest operating margins among hyperscalers at 45.6%
- OpenAI partnership providing exclusive AI capabilities

Key Concerns:
- Premium valuation at P/E 35.2 demands continued execution
- Enterprise AI budget scrutiny could slow Copilot adoption
- Regulatory risks around AI market dominance
- Gaming integration still in early innings

Conclusion: Microsoft has successfully translated its AI investments into revenue growth and margin expansion. The Copilot + Azure + OpenAI flywheel positions MSFT as the premier enterprise AI platform.`;

function buildStockFixture(
  symbol: string,
  financialOutput: string,
  newsOutput: string,
  analysisOutput: string,
  recommendation: Recommendation,
): StockFixture {
  return {
    symbol,
    agentOutputs: [
      {
        agent: "Data Explorer",
        output: financialOutput,
        tools: [
          {
            tool: "get_company_info",
            input: `symbol: "${symbol}"`,
            output: `Company profile retrieved — sector, market cap, P/E, EPS, 52-week range`,
          },
          {
            tool: "get_income_statements",
            input: `symbol: "${symbol}"`,
            output: `Income statements (3Y) — revenue, gross profit, net income, EBITDA trends`,
          },
        ],
      },
      {
        agent: "News Researcher",
        output: newsOutput,
        tools: [
          {
            tool: "EXASearchTool",
            input: `query: "latest news ${symbol} company 2026"`,
            output: `Found 6 articles — earnings, strategy updates, analyst commentary`,
          },
        ],
      },
      {
        agent: "Data Analyst",
        output: analysisOutput,
        tools: [],
        context: ["Data Explorer output (financial data)", "News Researcher output (latest news)"],
      },
      {
        agent: "Financial Expert",
        output: JSON.stringify(recommendation, null, 2),
        tools: [
          {
            tool: "get_current_stock_price",
            input: `symbol: "${symbol}"`,
            output: `$${recommendation.current_price.toFixed(2)}`,
          },
        ],
        context: ["Data Analyst output (comprehensive analysis)"],
      },
    ],
    recommendation,
    log: [
      { tag: "BOOT", text: `[${symbol}] Initializing Investment Advisor Crew (4 agents)` },
      { tag: "INFO", text: `[${symbol}] LLM: openai/gpt-4.1 via OpenRouter` },
      ...makeStockLog(symbol, "Data Explorer", 1, "Fetching financials via yfinance"),
      ...makeStockLog(symbol, "News Researcher", 2, "Searching latest news via EXA"),
      ...makeStockLog(symbol, "Data Analyst", 3, "Synthesizing financial data + news"),
      ...makeStockLog(symbol, "Financial Expert", 4, "Generating investment recommendation"),
      { tag: "SUCCESS", text: `[${symbol}] Pipeline complete — 4/4 agents finished` },
    ],
  };
}

export const AVAILABLE_STOCKS = ["AAPL", "GOOGL", "MSFT"] as const;
export type StockSymbol = (typeof AVAILABLE_STOCKS)[number];

export const STOCK_META: Record<StockSymbol, { name: string; sector: string }> = {
  AAPL: { name: "Apple Inc.", sector: "Technology" },
  GOOGL: { name: "Alphabet Inc.", sector: "Technology" },
  MSFT: { name: "Microsoft Corp.", sector: "Technology" },
};

export const stockFixtures: Record<StockSymbol, StockFixture> = {
  AAPL: buildStockFixture("AAPL", AAPL_FINANCIAL_ANALYSIS, AAPL_NEWS, AAPL_ANALYSIS, {
    action: "HOLD",
    confidence: 0.7,
    target_price: 300.0,
    current_price: 271.06,
    reasons: [
      "Formidable financial strength with high profit margins and robust free cash flow",
      "Recurring revenue from services and Apple Business platform provides stability",
      "Expansion in emerging markets and wearables create multiple growth avenues",
      "Premium P/E reflects investor confidence in AI and custom silicon innovation",
      "Leadership transition appears stable with strong operational continuity",
    ],
    risks: [
      "High valuation (P/E > 34) increases sensitivity to earnings disappointment",
      "Intense pressure to accelerate AI innovation vs rapidly advancing rivals",
      "CEO transition poses execution risks during a pivotal technology shift",
      "Rising R&D and manufacturing costs could pressure margins",
      "Market sentiment could shift if macro or competitive factors turn adverse",
    ],
  }),
  GOOGL: buildStockFixture("GOOGL", GOOGL_FINANCIAL_ANALYSIS, GOOGL_NEWS, GOOGL_ANALYSIS, {
    action: "BUY",
    confidence: 0.8,
    target_price: 230.0,
    current_price: 192.4,
    reasons: [
      "AI leadership through Gemini integration across product suite",
      "Google Cloud inflection with AI workloads driving 40% of new deals",
      "Reasonable valuation at P/E 24.8 relative to growth trajectory",
      "Massive $118.3B cash reserves enabling aggressive investment",
      "YouTube and Waymo providing diversification beyond core advertising",
    ],
    risks: [
      "Antitrust proceedings could force structural search remedies",
      "$45B capex may pressure free cash flow near-term",
      "Ad revenue still represents ~75% of total — cyclical exposure",
      "Competition from Microsoft/OpenAI in enterprise AI intensifying",
    ],
  }),
  MSFT: buildStockFixture("MSFT", MSFT_FINANCIAL_ANALYSIS, MSFT_NEWS, MSFT_ANALYSIS, {
    action: "BUY",
    confidence: 0.75,
    target_price: 540.0,
    current_price: 478.3,
    reasons: [
      "Industry-leading AI monetization through Copilot ecosystem",
      "Azure cloud growth sustained at 31% with AI workload acceleration",
      "Highest operating margins among hyperscalers at 45.6%",
      "OpenAI partnership providing exclusive enterprise AI capabilities",
      "GitHub Copilot surpassed 5M subscribers — developer ecosystem lock-in",
    ],
    risks: [
      "Premium valuation at P/E 35.2 demands continued execution",
      "Enterprise AI budget scrutiny could slow Copilot adoption rates",
      "Regulatory risks around AI market dominance",
      "Gaming integration still proving ROI post-Activision acquisition",
    ],
  }),
};

function makeParallelLog(symbol: string): LogLine[] {
  return [
    { tag: "BOOT", text: `Initializing Investment Advisor — V1 PARALLEL PIPELINE` },
    { tag: "INFO", text: `Target: ${symbol} | LLM: openai/gpt-4.1 via OpenRouter` },
    { tag: "INFO", text: `Phase 1: Data Explorer + News Researcher running in PARALLEL` },
    ...makeStockLog(symbol, "Data Explorer", 1, "Fetching financials via yfinance"),
    ...makeStockLog(symbol, "News Researcher", 2, "Searching latest news via EXA"),
    { tag: "OK", text: `Phase 1 complete — both agents finished in parallel` },
    { tag: "INFO", text: `Phase 2: Data Analyst + Financial Expert running SEQUENTIALLY` },
    ...makeStockLog(symbol, "Data Analyst", 3, "Synthesizing financial data + news"),
    ...makeStockLog(symbol, "Financial Expert", 4, "Generating InvestmentRecommendation (Pydantic)"),
    { tag: "OK", text: `Phase 2 complete — analysis and recommendation ready` },
    { tag: "SUCCESS", text: `Pipeline complete — 4/4 agents finished | Guardrail: PASSED` },
  ];
}

function makeDistributedLog(symbols: string[]): LogLine[] {
  const lines: LogLine[] = [
    { tag: "BOOT", text: `Initializing Investment Advisor — V2 DISTRIBUTED PIPELINE` },
    { tag: "INFO", text: `Watchlist: ${symbols.join(", ")} | ${symbols.length} crews spawned` },
    { tag: "INFO", text: `LLM: openai/gpt-4.1 via OpenRouter | asyncio.gather()` },
  ];
  for (const sym of symbols) {
    lines.push({ tag: "BOOT", text: `[${sym}] Crew spawned — 4 agents initialized` });
  }
  for (let agentNum = 1; agentNum <= 4; agentNum++) {
    const agentNames = ["Data Explorer", "News Researcher", "Data Analyst", "Financial Expert"];
    const details = [
      "Fetching financials via yfinance",
      "Searching latest news via EXA",
      "Synthesizing financial data + news",
      "Generating InvestmentRecommendation (Pydantic)",
    ];
    for (const sym of symbols) {
      lines.push({ tag: "PROCESS", text: `[${sym}] ${agentNames[agentNum - 1]} — ${details[agentNum - 1]}` });
    }
    for (const sym of symbols) {
      lines.push({ tag: "OK", text: `[${sym}] ${agentNames[agentNum - 1]} — output ready` });
    }
  }
  for (const sym of symbols) {
    lines.push({ tag: "SUCCESS", text: `[${sym}] Pipeline complete — Guardrail: PASSED` });
  }
  lines.push({ tag: "SUCCESS", text: `All ${symbols.length} crews finished — results aggregated` });
  return lines;
}

export function getParallelLog(symbol: StockSymbol): LogLine[] {
  return makeParallelLog(symbol);
}

export function getDistributedLog(symbols: StockSymbol[]): LogLine[] {
  return makeDistributedLog(symbols);
}

export const project: ProjectDef = {
  slug: "investment-advisor",
  tier: "advanced",
  number: "00",
  title: "Investment Advisor",
  codename: "INVEST_ADVISOR",
  blurb:
    "A 4-agent CrewAI pipeline that gathers financial data, researches latest news, synthesizes analysis, and generates structured investment recommendations with Pydantic output and guardrails. Single stock uses parallel execution; multiple stocks use distributed async crews.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenRouter", "yfinance", "EXA_Search", "Pydantic", "Guardrails"],
  pipeline: ["Data Explorer", "News Researcher", "Data Analyst", "Financial Expert"],
  inputSchema: [
    {
      key: "stock",
      label: "STOCK_SYMBOL",
      kind: "text",
      placeholder: "e.g. AAPL",
    },
  ],
  outputType: "json",
  fixture: {
    input: { stock: "AAPL" },
    output: JSON.stringify(stockFixtures.AAPL.recommendation, null, 2),
    log: makeParallelLog("AAPL"),
  },
  endpoint: "/api/advanced/investment-advisor",
};

import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Cpu,
  Layers,
  Search,
  Shield,
  Zap,
} from "lucide-react";

function Node({
  label,
  accent,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  accent: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-night border border-hairline rounded-sm overflow-hidden ${className}`}>
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-hairline"
        style={{ backgroundColor: `${accent}10` }}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span
          className="font-code text-[10px] tracking-widest uppercase font-bold"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
      <div className="px-3 py-3 space-y-1.5">{children}</div>
    </div>
  );
}

function KV({ k, v, accent }: { k: string; v: string; accent: string }) {
  return (
    <div className="font-code text-[11px] leading-snug">
      <span className="text-gray3">{k}: </span>
      <span style={{ color: accent }}>{v}</span>
    </div>
  );
}

function Connector({ direction = "down" }: { direction?: "down" | "right" }) {
  return direction === "down" ? (
    <div className="flex justify-center py-1">
      <ArrowDown className="w-4 h-4 text-gray3" />
    </div>
  ) : (
    <ArrowRight className="w-4 h-4 text-gray3 shrink-0" />
  );
}

export function InvestmentArchDiagram({ accent }: { accent: string }) {
  return (
    <div className="space-y-8">
      {/* V1 Architecture */}
      <div className="bg-surface rounded border border-hairline p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3">
            V1_ARCHITECTURE // PARALLEL + SEQUENTIAL
          </span>
          <span
            className="font-code text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
            style={{ borderColor: accent, color: accent }}
          >
            SINGLE STOCK
          </span>
        </div>

        <div className="flex flex-col items-center gap-0 max-w-4xl mx-auto">
          {/* Input */}
          <Node label="INPUT" accent={accent} icon={Layers} className="w-full max-w-sm">
            <KV k="stock" v="AAPL (single symbol)" accent={accent} />
            <div className="font-code text-[11px] text-gray2 mt-1">
              ThreadPoolExecutor spawns 2 parallel workers
            </div>
          </Node>

          <Connector />

          {/* Phase 1 — Parallel */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="font-code text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                style={{ borderColor: accent, color: accent }}
              >
                PHASE 1 // PARALLEL
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Node label="AGENT_01 // DATA_EXPLORER" accent={accent} icon={BarChart3} className="w-full">
                <KV k="role" v="Data Researcher" accent={accent} />
                <KV k="tools" v="get_company_info, get_income_statements" accent={accent} />
                <div className="font-code text-[11px] text-gray2 mt-1">
                  Fetches financial data via yfinance API
                </div>
              </Node>
              <Node label="AGENT_02 // NEWS_RESEARCHER" accent={accent} icon={Search} className="w-full">
                <KV k="role" v="News and Info Researcher" accent={accent} />
                <KV k="tools" v="EXASearchTool" accent={accent} />
                <div className="font-code text-[11px] text-gray2 mt-1">
                  Searches latest news and business information
                </div>
              </Node>
            </div>
          </div>

          <Connector />

          {/* Phase 2 — Sequential */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="font-code text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                style={{ borderColor: accent, color: accent }}
              >
                PHASE 2 // SEQUENTIAL
              </span>
            </div>
            <div className="max-w-lg mx-auto space-y-1">
              <Node label="AGENT_03 // DATA_ANALYST" accent={accent} icon={Cpu} className="w-full">
                <KV k="role" v="Data Analyst" accent={accent} />
                <KV k="context" v="[Data Explorer, News Researcher]" accent={accent} />
                <div className="font-code text-[11px] text-gray2 mt-1">
                  Synthesizes financial data + news into analysis
                </div>
              </Node>
              <Connector />
              <Node label="AGENT_04 // FINANCIAL_EXPERT" accent={accent} icon={Shield} className="w-full">
                <KV k="role" v="Financial Expert" accent={accent} />
                <KV k="tools" v="get_current_stock_price" accent={accent} />
                <KV k="output" v="InvestmentRecommendation (Pydantic)" accent={accent} />
                <KV k="guardrail" v="validate_recommendation()" accent={accent} />
              </Node>
            </div>
          </div>

          <Connector />

          {/* Output */}
          <div
            className="w-full max-w-lg bg-night border rounded-sm overflow-hidden"
            style={{ borderColor: `${accent}60` }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{ backgroundColor: `${accent}15`, borderColor: `${accent}40` }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: accent }} />
              <span className="font-code text-[10px] tracking-widest uppercase font-bold" style={{ color: accent }}>
                STRUCTURED OUTPUT
              </span>
            </div>
            <div className="px-3 py-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              <KV k="action" v="BUY | HOLD | SELL" accent={accent} />
              <KV k="confidence" v="0.0 — 1.0" accent={accent} />
              <KV k="target_price" v="12-month target" accent={accent} />
              <KV k="current_price" v="live market price" accent={accent} />
              <KV k="reasons" v="list[str]" accent={accent} />
              <KV k="risks" v="list[str]" accent={accent} />
            </div>
          </div>
        </div>
      </div>

      {/* V2 Architecture */}
      <div className="bg-surface rounded border border-hairline p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3">
            V2_ARCHITECTURE // DISTRIBUTED ASYNC
          </span>
          <span
            className="font-code text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
            style={{ borderColor: accent, color: accent }}
          >
            MULTI-STOCK WATCHLIST
          </span>
        </div>

        <div className="flex flex-col items-center gap-0 max-w-4xl mx-auto">
          {/* Input */}
          <Node label="INPUT" accent={accent} icon={Layers} className="w-full max-w-sm">
            <KV k="watchlist" v='["AAPL", "GOOGL", "MSFT"]' accent={accent} />
            <div className="font-code text-[11px] text-gray2 mt-1">
              asyncio.gather() spawns N concurrent crews
            </div>
          </Node>

          <Connector />

          {/* Distributed crews */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="font-code text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                style={{ borderColor: accent, color: accent }}
              >
                DISTRIBUTED_CREWS // ASYNC
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {["AAPL", "GOOGL", "MSFT"].map((sym) => (
                <div key={sym} className="bg-night border border-hairline rounded-sm overflow-hidden">
                  <div
                    className="px-3 py-2 border-b border-hairline"
                    style={{ backgroundColor: `${accent}10` }}
                  >
                    <span className="font-code text-[10px] tracking-widest uppercase font-bold" style={{ color: accent }}>
                      CREW_{sym}
                    </span>
                  </div>
                  <div className="px-3 py-3 space-y-1">
                    {[
                      "01 Data Explorer",
                      "02 News Researcher",
                      "03 Data Analyst",
                      "04 Financial Expert",
                    ].map((agent) => (
                      <div key={agent} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        <span className="font-code text-[10px] text-gray2">{agent}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-hairline">
                      <KV k="output" v="InvestmentRecommendation" accent={accent} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Connector />

          {/* Aggregated output */}
          <div
            className="w-full max-w-lg bg-night border rounded-sm overflow-hidden"
            style={{ borderColor: `${accent}60` }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{ backgroundColor: `${accent}15`, borderColor: `${accent}40` }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: accent }} />
              <span className="font-code text-[10px] tracking-widest uppercase font-bold" style={{ color: accent }}>
                AGGREGATED RESULTS
              </span>
            </div>
            <div className="px-3 py-3">
              <div className="font-code text-[11px] text-gray2">
                dict(zip(stocks, results)) — each stock mapped to its InvestmentRecommendation
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["AAPL", "GOOGL", "MSFT"].map((sym) => (
                  <div key={sym} className="text-center">
                    <span className="font-code text-[10px] font-bold" style={{ color: accent }}>{sym}</span>
                    <div className="font-code text-[9px] text-gray3">BUY/HOLD/SELL</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack note */}
      <div className="bg-surface rounded border border-hairline p-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">LLM</div>
            <div className="font-code text-[11px]" style={{ color: accent }}>openai/gpt-4.1 via OpenRouter</div>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Data Source</div>
            <div className="font-code text-[11px]" style={{ color: accent }}>yfinance + EXA Search API</div>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Output Schema</div>
            <div className="font-code text-[11px]" style={{ color: accent }}>Pydantic InvestmentRecommendation</div>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Guardrail</div>
            <div className="font-code text-[11px]" style={{ color: accent }}>validate_recommendation()</div>
          </div>
        </div>
      </div>
    </div>
  );
}

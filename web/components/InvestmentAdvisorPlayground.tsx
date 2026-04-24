"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Search,
  BarChart3,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { LogLine, ProjectDef } from "@/lib/projects/schema";
import { TIERS } from "@/lib/projects/tiers";
import { TerminalWindow } from "@/components/Terminal/Window";
import {
  AVAILABLE_STOCKS,
  STOCK_META,
  stockFixtures,
  getParallelLog,
  getDistributedLog,
  type StockSymbol,
  type StockFixture,
  type Recommendation,
  type ToolCall,
} from "@/lib/projects/advanced/00-investment-advisor";

type AgentState = "idle" | "running" | "done";

const AGENT_DEFS = [
  { key: "data_explorer", label: "DATA_EXPLORER", num: "01", icon: BarChart3 },
  { key: "news_researcher", label: "NEWS_RESEARCHER", num: "02", icon: Search },
  { key: "data_analyst", label: "DATA_ANALYST", num: "03", icon: Zap },
  { key: "financial_expert", label: "FINANCIAL_EXPERT", num: "04", icon: Shield },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function tagColor(tag: string | undefined, accent: string): string {
  if (!tag) return "#A0A0A0";
  if (tag === "OK" || tag === "SUCCESS") return "#B8EF43";
  if (tag === "WARN") return "#FFD166";
  if (tag === "ERROR") return "#FF5F57";
  if (tag === "INFO") return "#00FFFF";
  if (tag === "PROCESS") return accent;
  if (tag === "BOOT") return accent;
  return "#A0A0A0";
}

function actionColor(action: string): string {
  if (action === "BUY") return "#B8EF43";
  if (action === "SELL") return "#FF5F57";
  return "#FFD166";
}

function ActionIcon({ action }: { action: string }) {
  if (action === "BUY") return <TrendingUp className="w-5 h-5" />;
  if (action === "SELL") return <TrendingDown className="w-5 h-5" />;
  return <Minus className="w-5 h-5" />;
}

export function InvestmentAdvisorPlayground({ project }: { project: ProjectDef }) {
  const meta = TIERS[project.tier];
  const [selected, setSelected] = useState<StockSymbol[]>(["AAPL"]);
  const [globalState, setGlobalState] = useState<"idle" | "running" | "done">("idle");
  const [streamLog, setStreamLog] = useState<LogLine[]>([]);
  const abortRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isV1 = selected.length === 1;
  const pipelineLabel = isV1
    ? "V1 — PARALLEL PIPELINE"
    : `V2 — DISTRIBUTED PIPELINE (${selected.length} CREWS)`;

  const [v1AgentStates, setV1AgentStates] = useState<AgentState[]>(["idle", "idle", "idle", "idle"]);
  const [v1AgentOutputs, setV1AgentOutputs] = useState<string[]>(["", "", "", ""]);

  const [v2StockStates, setV2StockStates] = useState<Record<string, AgentState[]>>({});
  const [v2StockOutputs, setV2StockOutputs] = useState<Record<string, string[]>>({});
  const [v2Expanded, setV2Expanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamLog.length]);

  function toggleStock(s: StockSymbol) {
    if (globalState === "running") return;
    setSelected((prev) => {
      if (prev.includes(s)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== s);
      }
      return [...prev, s];
    });
  }

  const reset = useCallback(() => {
    abortRef.current = true;
    setGlobalState("idle");
    setStreamLog([]);
    setV1AgentStates(["idle", "idle", "idle", "idle"]);
    setV1AgentOutputs(["", "", "", ""]);
    setV2StockStates({});
    setV2StockOutputs({});
    setV2Expanded({});
  }, []);

  async function streamAgentOutput(
    output: string,
    setOutputs: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) {
    const lines = output.split("\n");
    for (let j = 0; j < lines.length; j++) {
      if (abortRef.current) return;
      await sleep(15);
      setOutputs((s) => {
        const next = [...s];
        next[index] = next[index] + (j > 0 ? "\n" : "") + lines[j];
        return next;
      });
    }
  }

  async function runV1() {
    abortRef.current = false;
    setV1AgentStates(["idle", "idle", "idle", "idle"]);
    setV1AgentOutputs(["", "", "", ""]);
    setStreamLog([]);
    setGlobalState("running");

    const symbol = selected[0];
    const fixture = stockFixtures[symbol];
    const log = getParallelLog(symbol);
    let idx = 0;

    const emit = async (delayMs: number) => {
      if (idx >= log.length || abortRef.current) return;
      await sleep(delayMs);
      const entry = log[idx++];
      if (entry) setStreamLog((s) => [...s, entry]);
    };

    for (let i = 0; i < 3; i++) await emit(200);
    if (abortRef.current) return;

    setV1AgentStates(["running", "running", "idle", "idle"]);

    for (let i = 0; i < 8; i++) await emit(180);
    if (abortRef.current) return;

    await Promise.all([
      streamAgentOutput(fixture.agentOutputs[0].output, setV1AgentOutputs, 0),
      streamAgentOutput(fixture.agentOutputs[1].output, setV1AgentOutputs, 1),
    ]);

    setV1AgentStates(["done", "done", "idle", "idle"]);
    if (abortRef.current) return;

    await emit(300);
    await emit(0);

    setV1AgentStates(["done", "done", "running", "idle"]);
    for (let i = 0; i < 4; i++) await emit(180);
    if (abortRef.current) return;

    await streamAgentOutput(fixture.agentOutputs[2].output, setV1AgentOutputs, 2);
    setV1AgentStates(["done", "done", "done", "idle"]);

    await sleep(200);

    setV1AgentStates(["done", "done", "done", "running"]);
    for (let i = 0; i < 4; i++) await emit(180);
    if (abortRef.current) return;

    await streamAgentOutput(fixture.agentOutputs[3].output, setV1AgentOutputs, 3);
    setV1AgentStates(["done", "done", "done", "done"]);

    while (idx < log.length) {
      if (abortRef.current) return;
      await emit(200);
    }

    setGlobalState("done");
  }

  async function runV2() {
    abortRef.current = false;
    const initStates: Record<string, AgentState[]> = {};
    const initOutputs: Record<string, string[]> = {};
    const initExpanded: Record<string, boolean> = {};
    for (const sym of selected) {
      initStates[sym] = ["idle", "idle", "idle", "idle"];
      initOutputs[sym] = ["", "", "", ""];
      initExpanded[sym] = true;
    }
    setV2StockStates(initStates);
    setV2StockOutputs(initOutputs);
    setV2Expanded(initExpanded);
    setStreamLog([]);
    setGlobalState("running");

    const stocks = [...selected];
    const log = getDistributedLog(stocks);
    let logIdx = 0;

    const pushLog = async (delayMs: number) => {
      if (logIdx >= log.length) return;
      await sleep(delayMs);
      const entry = log[logIdx++];
      if (entry) setStreamLog((s) => [...s, entry]);
    };

    for (let i = 0; i < 3 + stocks.length; i++) {
      if (abortRef.current) return;
      await pushLog(200);
    }

    for (let agentIdx = 0; agentIdx < 4; agentIdx++) {
      for (const sym of stocks) {
        if (abortRef.current) return;
        setV2StockStates((s) => {
          const next = { ...s };
          next[sym] = [...next[sym]];
          next[sym][agentIdx] = "running";
          return next;
        });
      }

      for (const sym of stocks) {
        if (abortRef.current) return;
        await pushLog(120);
      }

      const outputPromises = stocks.map((sym) => {
        const fixture = stockFixtures[sym];
        const output = fixture.agentOutputs[agentIdx].output;
        return (async () => {
          const lines = output.split("\n");
          for (let j = 0; j < lines.length; j++) {
            if (abortRef.current) return;
            await sleep(10);
            setV2StockOutputs((s) => {
              const next = { ...s };
              next[sym] = [...next[sym]];
              next[sym][agentIdx] = next[sym][agentIdx] + (j > 0 ? "\n" : "") + lines[j];
              return next;
            });
          }
        })();
      });
      await Promise.all(outputPromises);

      for (const sym of stocks) {
        if (abortRef.current) return;
        await pushLog(80);
        setV2StockStates((s) => {
          const next = { ...s };
          next[sym] = [...next[sym]];
          next[sym][agentIdx] = "done";
          return next;
        });
      }

      await sleep(200);
    }

    while (logIdx < log.length) {
      if (abortRef.current) return;
      await pushLog(150);
    }

    setGlobalState("done");
  }

  function run() {
    if (isV1) runV1();
    else runV2();
  }

  return (
    <div className="space-y-8">
      {/* Pipeline mode badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="font-headline font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-sm border"
          style={{ borderColor: meta.accent, color: meta.accent }}
        >
          {pipelineLabel}
        </span>
        <span className="font-code text-[10px] text-gray3 uppercase tracking-widest">
          {isV1 ? "THREADPOOL_EXECUTOR // PARALLEL PHASE 1" : "ASYNCIO.GATHER // DISTRIBUTED CREWS"}
        </span>
      </div>

      {/* Stock chip selector */}
      <TerminalWindow
        title={`# STOCK_SELECTOR // ${project.codename}`}
        rightLabel={`${selected.length} SELECTED`}
        accent={meta.accent}
        bodyClassName="space-y-5"
      >
        <div>
          <label
            className="block font-headline text-[10px] tracking-widest uppercase font-bold mb-3"
            style={{ color: meta.accent }}
          >
            <span className="text-gray3 mr-2">{">>>"}</span>
            SELECT_STOCKS
          </label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_STOCKS.map((sym) => {
              const isSelected = selected.includes(sym);
              const m = STOCK_META[sym];
              return (
                <button
                  key={sym}
                  onClick={() => toggleStock(sym)}
                  disabled={globalState === "running"}
                  className="group relative px-4 py-3 rounded-sm border transition-all disabled:opacity-60"
                  style={{
                    borderColor: isSelected ? meta.accent : "rgba(255,255,255,0.08)",
                    backgroundColor: isSelected ? `${meta.accent}10` : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: isSelected ? meta.accent : "#6B6B6B" }}
                    />
                    <span
                      className="font-headline font-bold text-sm tracking-tight"
                      style={{ color: isSelected ? meta.accent : "#E0E0E0" }}
                    >
                      {sym}
                    </span>
                    <span className="font-code text-[10px] text-gray3 uppercase">{m.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-code text-[10px] text-gray3 uppercase tracking-widest">
              {selected.length} stock{selected.length > 1 ? "s" : ""} selected
            </span>
            <span className="font-code text-[10px] uppercase tracking-widest" style={{ color: meta.accent }}>
              {isV1 ? "→ V1 PARALLEL PIPELINE (single stock)" : `→ V2 DISTRIBUTED PIPELINE (${selected.length} async crews)`}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-hairline flex items-center justify-between">
          <span className="font-code text-xs text-gray3">
            <span style={{ color: meta.accent }}>system@invest-advisor:~$</span>{" "}
            {globalState === "idle" ? <span className="terminal-cursor" /> : null}
          </span>

          <div className="flex items-center gap-2">
            {globalState !== "idle" && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 bg-transparent border border-hairline text-gray2 font-headline font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-surface-hover hover:text-ink transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET
              </button>
            )}
            <button
              onClick={run}
              disabled={globalState === "running"}
              className="inline-flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
              style={{ backgroundColor: meta.accent, color: "#08090A" }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {globalState === "running" ? "RUNNING..." : "RUN ANALYSIS"}
            </button>
          </div>
        </div>
      </TerminalWindow>

      {/* V1 Mode — Single Stock */}
      {isV1 && (
        <V1View
          symbol={selected[0]}
          agentStates={v1AgentStates}
          agentOutputs={v1AgentOutputs}
          accent={meta.accent}
          globalState={globalState}
        />
      )}

      {/* V2 Mode — Multi-Stock */}
      {!isV1 && (
        <V2View
          symbols={selected}
          stockStates={v2StockStates}
          stockOutputs={v2StockOutputs}
          expanded={v2Expanded}
          setExpanded={setV2Expanded}
          accent={meta.accent}
          globalState={globalState}
        />
      )}

      {/* Live execution log */}
      <div className="bg-surface rounded border border-hairline overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-hairline bg-night">
          <span
            className="font-code text-[11px] tracking-widest uppercase"
            style={{ color: meta.accent }}
          >
            LIVE_EXECUTION_LOG // {project.slug}
          </span>
          <span className="font-code text-[10px] tracking-widest uppercase text-gray3">
            {streamLog.length} EVENTS
          </span>
        </div>
        <div className="p-5 max-h-56 overflow-auto">
          {streamLog.length === 0 ? (
            <p className="font-code text-xs text-gray3">
              [STREAM] No active execution. Select stocks and run analysis.
            </p>
          ) : (
            <div className="space-y-1.5">
              {streamLog.map((line, i) => {
                if (!line) return null;
                return (
                  <div key={i} className="font-code text-xs flex gap-3 animate-log-in">
                    <span className="text-gray3 shrink-0">
                      [{(i * 0.3).toFixed(2).padStart(5, "0")}]
                    </span>
                    {line.tag && (
                      <span className="font-bold shrink-0" style={{ color: tagColor(line.tag, meta.accent) }}>
                        [{line.tag}]
                      </span>
                    )}
                    <span className="text-gray2 break-words">{line.text}</span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── V1 View: Parallel + Sequential ─── */

function V1View({
  symbol,
  agentStates,
  agentOutputs,
  accent,
  globalState,
}: {
  symbol: StockSymbol;
  agentStates: AgentState[];
  agentOutputs: string[];
  accent: string;
  globalState: "idle" | "running" | "done";
}) {
  const fixture = stockFixtures[symbol];

  return (
    <div className="space-y-6">
      {/* Phase 1: Parallel */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-headline font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border"
            style={{ borderColor: accent, color: accent }}
          >
            PHASE 1 // PARALLEL
          </span>
          <span className="font-code text-[10px] text-gray3">ThreadPoolExecutor — 2 workers</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <AgentPanel
            def={AGENT_DEFS[0]}
            state={agentStates[0]}
            output={agentOutputs[0]}
            accent={accent}
            tools={fixture.agentOutputs[0].tools}
            context={fixture.agentOutputs[0].context}
            isJson={false}
          />
          <AgentPanel
            def={AGENT_DEFS[1]}
            state={agentStates[1]}
            output={agentOutputs[1]}
            accent={accent}
            tools={fixture.agentOutputs[1].tools}
            context={fixture.agentOutputs[1].context}
            isJson={false}
          />
        </div>
      </div>

      {/* Arrow connector */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-4" style={{ backgroundColor: `${accent}40` }} />
          <span className="font-code text-[9px] text-gray3 uppercase tracking-widest">context flows down</span>
          <div className="w-px h-4" style={{ backgroundColor: `${accent}40` }} />
        </div>
      </div>

      {/* Phase 2: Sequential */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-headline font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border"
            style={{ borderColor: accent, color: accent }}
          >
            PHASE 2 // SEQUENTIAL
          </span>
          <span className="font-code text-[10px] text-gray3">Context-dependent analysis chain</span>
        </div>
        <div className="space-y-4">
          <AgentPanel
            def={AGENT_DEFS[2]}
            state={agentStates[2]}
            output={agentOutputs[2]}
            accent={accent}
            tools={fixture.agentOutputs[2].tools}
            context={fixture.agentOutputs[2].context}
            isJson={false}
          />
          <AgentPanel
            def={AGENT_DEFS[3]}
            state={agentStates[3]}
            output={agentOutputs[3]}
            accent={accent}
            tools={fixture.agentOutputs[3].tools}
            context={fixture.agentOutputs[3].context}
            isJson={true}
          />
        </div>
      </div>

      {/* Recommendation card */}
      {globalState === "done" && (
        <RecommendationCard recommendation={fixture.recommendation} symbol={symbol} accent={accent} />
      )}
    </div>
  );
}

/* ─── V2 View: Distributed Multi-Stock ─── */

function V2View({
  symbols,
  stockStates,
  stockOutputs,
  expanded,
  setExpanded,
  accent,
  globalState,
}: {
  symbols: StockSymbol[];
  stockStates: Record<string, AgentState[]>;
  stockOutputs: Record<string, string[]>;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  accent: string;
  globalState: "idle" | "running" | "done";
}) {
  return (
    <div className="space-y-6">
      {/* Per-stock crew panels */}
      {symbols.map((sym) => {
        const states = stockStates[sym] ?? ["idle", "idle", "idle", "idle"];
        const outputs = stockOutputs[sym] ?? ["", "", "", ""];
        const fixture = stockFixtures[sym];
        const isExpanded = expanded[sym] ?? false;
        const completedAgents = states.filter((s) => s === "done").length;
        const isRunning = states.some((s) => s === "running");

        return (
          <div key={sym} className="bg-terminal rounded border border-hairline overflow-hidden">
            {/* Stock crew header */}
            <button
              onClick={() => setExpanded((s) => ({ ...s, [sym]: !s[sym] }))}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${isRunning ? "animate-pulse" : ""}`}
                  style={{
                    backgroundColor: completedAgents === 4 ? "#B8EF43" : isRunning ? accent : "#6B6B6B",
                  }}
                />
                <span className="font-headline font-bold text-sm" style={{ color: accent }}>
                  CREW_{sym}
                </span>
                <span className="font-code text-[10px] text-gray3 uppercase">
                  {STOCK_META[sym].name}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {states.map((s, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: s === "done" ? "#B8EF43" : s === "running" ? accent : "#3A3A3A",
                      }}
                    />
                  ))}
                </div>
                <span className="font-code text-[10px] text-gray3">
                  {completedAgents}/4 AGENTS
                </span>
              </div>
              <div className="flex items-center gap-3">
                {completedAgents === 4 && (
                  <span
                    className="font-headline font-bold text-xs px-2 py-0.5 rounded-sm"
                    style={{ backgroundColor: actionColor(fixture.recommendation.action), color: "#08090A" }}
                  >
                    {fixture.recommendation.action}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray3" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray3" />
                )}
              </div>
            </button>

            {/* Expanded agent details */}
            {isExpanded && (
              <div className="p-4 space-y-3">
                {AGENT_DEFS.map((def, i) => (
                  <CompactAgentPanel
                    key={def.key}
                    def={def}
                    state={states[i]}
                    output={outputs[i]}
                    accent={accent}
                    tools={fixture.agentOutputs[i].tools}
                    context={fixture.agentOutputs[i].context}
                    isJson={i === 3}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Summary comparison table */}
      {globalState === "done" && (
        <div className="bg-surface rounded border border-hairline overflow-hidden">
          <div className="px-5 py-3 border-b border-hairline bg-night">
            <span className="font-code text-[11px] tracking-widest uppercase" style={{ color: accent }}>
              WATCHLIST_SUMMARY // COMPARISON
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Stock</th>
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Action</th>
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Confidence</th>
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Current</th>
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Target</th>
                  <th className="px-5 py-3 text-left font-code text-[10px] uppercase tracking-widest text-gray3">Upside</th>
                </tr>
              </thead>
              <tbody>
                {symbols.map((sym) => {
                  const rec = stockFixtures[sym].recommendation;
                  const upside = ((rec.target_price - rec.current_price) / rec.current_price * 100).toFixed(1);
                  return (
                    <tr key={sym} className="border-b border-hairline last:border-b-0">
                      <td className="px-5 py-3">
                        <span className="font-headline font-bold text-sm" style={{ color: accent }}>{sym}</span>
                        <span className="font-code text-[10px] text-gray3 ml-2">{STOCK_META[sym].name}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 font-headline font-bold text-xs px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: actionColor(rec.action), color: "#08090A" }}
                        >
                          <ActionIcon action={rec.action} />
                          {rec.action}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-night overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${rec.confidence * 100}%`, backgroundColor: accent }}
                            />
                          </div>
                          <span className="font-code text-xs text-ink">{(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-code text-xs text-ink">${rec.current_price.toFixed(2)}</td>
                      <td className="px-5 py-3 font-code text-xs" style={{ color: accent }}>${rec.target_price.toFixed(2)}</td>
                      <td className="px-5 py-3 font-code text-xs" style={{ color: Number(upside) > 0 ? "#B8EF43" : "#FF5F57" }}>
                        {Number(upside) > 0 ? "+" : ""}{upside}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Agent Panel (V1 full-width) ─── */

function AgentPanel({
  def,
  state,
  output,
  accent,
  tools,
  context,
  isJson,
}: {
  def: (typeof AGENT_DEFS)[number];
  state: AgentState;
  output: string;
  accent: string;
  tools: ToolCall[];
  context?: string[];
  isJson: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "running") {
      ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
    }
  }, [output, state]);

  const statusColor = state === "running" ? accent : state === "done" ? "#B8EF43" : "#6B6B6B";
  const statusText = state === "running" ? "EXECUTING" : state === "done" ? "COMPLETE" : "IDLE";
  const showMeta = state === "running" || state === "done";
  const Icon = def.icon;

  return (
    <div className="bg-terminal rounded border border-hairline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-surface">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full ${state === "running" ? "animate-pulse" : ""}`}
            style={{ backgroundColor: statusColor }}
          />
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
          <span className="font-code text-[11px] tracking-widest uppercase" style={{ color: accent }}>
            AGENT_{def.num} // {def.label}
          </span>
        </div>
        <span className="font-code text-[10px] tracking-widest uppercase" style={{ color: statusColor }}>
          {statusText}
        </span>
      </div>

      {showMeta && (tools.length > 0 || (context && context.length > 0)) && (
        <div className="px-4 py-3 border-b border-hairline bg-night/40 space-y-2.5">
          {context && context.length > 0 && (
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 text-gray3 mt-0.5 shrink-0" />
              <div>
                <span className="font-code text-[9px] tracking-widest uppercase text-gray3">CONTEXT_INPUT</span>
                <div className="mt-0.5 space-y-0.5">
                  {context.map((c, i) => (
                    <div key={i} className="font-code text-[11px] text-gray2">{c}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tools.map((t, i) => (
            <div key={i} className="rounded-sm border border-hairline bg-night overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-1.5 border-b border-hairline"
                style={{ backgroundColor: `${accent}08` }}
              >
                <BarChart3 className="w-3 h-3" style={{ color: accent }} />
                <span className="font-code text-[10px] tracking-widest uppercase font-bold" style={{ color: accent }}>
                  {t.tool}
                </span>
              </div>
              <div className="px-3 py-2 space-y-1">
                <div className="font-code text-[11px]">
                  <span className="text-gray3">input: </span>
                  <span className="text-ink">{t.input}</span>
                </div>
                <div className="font-code text-[11px]">
                  <span className="text-gray3">output: </span>
                  <span style={{ color: "#B8EF43" }}>{t.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={ref} className="p-4 min-h-[80px] max-h-[300px] overflow-auto">
        {state === "idle" && !output && (
          <p className="font-code text-sm text-gray3">[IDLE] Waiting for pipeline execution...</p>
        )}
        {state === "running" && !output && (
          <div className="space-y-2">
            <div className="h-3 w-3/4 bg-surface rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-surface rounded animate-pulse" />
          </div>
        )}
        {output && (
          <>
            <div className="font-headline text-[9px] tracking-widest uppercase font-bold text-gray3 mb-2">
              AGENT_OUTPUT:
            </div>
            <pre
              className="font-code text-sm whitespace-pre-wrap leading-relaxed"
              style={{ color: isJson ? "#B8EF43" : undefined }}
            >
              {output}
              {state === "running" && <span className="terminal-cursor" />}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Compact Agent Panel (V2 inside crew) ─── */

function CompactAgentPanel({
  def,
  state,
  output,
  accent,
  tools,
  context,
  isJson,
}: {
  def: (typeof AGENT_DEFS)[number];
  state: AgentState;
  output: string;
  accent: string;
  tools: ToolCall[];
  context?: string[];
  isJson: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = state === "running" ? accent : state === "done" ? "#B8EF43" : "#6B6B6B";
  const Icon = def.icon;

  return (
    <div className="rounded-sm border border-hairline overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${state === "running" ? "animate-pulse" : ""}`}
            style={{ backgroundColor: statusColor }}
          />
          <Icon className="w-3 h-3" style={{ color: accent }} />
          <span className="font-code text-[10px] tracking-widest uppercase" style={{ color: accent }}>
            {def.num} // {def.label}
          </span>
          {tools.length > 0 && (
            <div className="flex gap-1 ml-1">
              {tools.map((t, i) => (
                <span key={i} className="font-code text-[8px] uppercase px-1 py-0.5 rounded-sm bg-night text-gray3 border border-hairline">
                  {t.tool}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-code text-[9px] uppercase" style={{ color: statusColor }}>
            {state === "running" ? "EXEC" : state === "done" ? "DONE" : "IDLE"}
          </span>
          {expanded ? <ChevronDown className="w-3 h-3 text-gray3" /> : <ChevronRight className="w-3 h-3 text-gray3" />}
        </div>
      </button>
      {expanded && output && (
        <div className="px-3 py-2 bg-night max-h-[200px] overflow-auto border-t border-hairline">
          <pre
            className="font-code text-[11px] whitespace-pre-wrap leading-relaxed"
            style={{ color: isJson ? "#B8EF43" : "#E0E0E0" }}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ─── Recommendation Card ─── */

function RecommendationCard({
  recommendation: rec,
  symbol,
  accent,
}: {
  recommendation: Recommendation;
  symbol: StockSymbol;
  accent: string;
}) {
  const upside = ((rec.target_price - rec.current_price) / rec.current_price * 100).toFixed(1);

  return (
    <div
      className="rounded border overflow-hidden"
      style={{ borderColor: actionColor(rec.action) }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{
          backgroundColor: `${actionColor(rec.action)}15`,
          borderColor: actionColor(rec.action),
        }}
      >
        <div className="flex items-center gap-3">
          <ActionIcon action={rec.action} />
          <span className="font-headline font-bold text-lg uppercase" style={{ color: actionColor(rec.action) }}>
            {rec.action}
          </span>
          <span className="font-headline font-bold text-lg" style={{ color: accent }}>{symbol}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-code text-[9px] text-gray3 uppercase">Confidence</div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 rounded-full bg-night overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${rec.confidence * 100}%`, backgroundColor: accent }}
                />
              </div>
              <span className="font-headline font-bold text-sm" style={{ color: accent }}>
                {(rec.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface p-5">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Current Price</div>
            <div className="font-headline font-bold text-xl text-ink">${rec.current_price.toFixed(2)}</div>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Target Price</div>
            <div className="font-headline font-bold text-xl" style={{ color: accent }}>${rec.target_price.toFixed(2)}</div>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-1">Potential Upside</div>
            <div
              className="font-headline font-bold text-xl"
              style={{ color: Number(upside) > 0 ? "#B8EF43" : "#FF5F57" }}
            >
              {Number(upside) > 0 ? "+" : ""}{upside}%
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-2">Key Reasons</div>
            <ul className="space-y-1.5">
              {rec.reasons.map((r, i) => (
                <li key={i} className="flex gap-2 font-code text-[11px] text-gray2">
                  <span style={{ color: "#B8EF43" }}>+</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-code text-[9px] text-gray3 uppercase tracking-widest mb-2">Key Risks</div>
            <ul className="space-y-1.5">
              {rec.risks.map((r, i) => (
                <li key={i} className="flex gap-2 font-code text-[11px] text-gray2">
                  <span style={{ color: "#FF5F57" }}>!</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

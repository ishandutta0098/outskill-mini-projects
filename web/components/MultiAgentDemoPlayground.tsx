"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { LogLine, ProjectDef } from "@/lib/projects/schema";
import { TIERS } from "@/lib/projects/tiers";
import { InputPrompt } from "@/components/Terminal/InputPrompt";
import { TerminalWindow } from "@/components/Terminal/Window";
import type { ToolCall } from "@/lib/projects/intermediate/00-devops-log-analyzer";
import { demoData } from "@/lib/projects/intermediate/00-devops-log-analyzer";
import { FileText, Search, ArrowRight, Link2 } from "lucide-react";

type AgentState = "idle" | "running" | "done";

const AGENTS: { key: string; label: string; num: string }[] = [
  { key: "log_analyzer", label: "LOG_ANALYZER", num: "01" },
  { key: "issue_investigator", label: "ISSUE_INVESTIGATOR", num: "02" },
  { key: "solution_specialist", label: "SOLUTION_SPECIALIST", num: "03" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function tagColor(tag: string | undefined, accent: string): string {
  if (!tag) return "#A0A0A0";
  if (tag === "OK" || tag === "SUCCESS") return "#B8EF43";
  if (tag === "WARN") return "#FFD166";
  if (tag === "ERROR") return "#FF5F57";
  if (tag === "INFO") return "#00FFFF";
  if (tag === "PROCESS") return accent;
  return "#A0A0A0";
}

export function MultiAgentDemoPlayground({ project }: { project: ProjectDef }) {
  const meta = TIERS[project.tier];
  const [values, setValues] = useState<Record<string, string>>(project.fixture.input);
  const [agentStates, setAgentStates] = useState<AgentState[]>(["idle", "idle", "idle"]);
  const [agentOutputs, setAgentOutputs] = useState<string[]>(["", "", ""]);
  const [globalState, setGlobalState] = useState<"idle" | "running" | "done">("idle");
  const [streamLog, setStreamLog] = useState<LogLine[]>([]);
  const abortRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamLog.length]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setAgentStates(["idle", "idle", "idle"]);
    setAgentOutputs(["", "", ""]);
    setGlobalState("idle");
    setStreamLog([]);
    setValues(project.fixture.input);
  }, [project.fixture.input]);

  function setField(key: string, v: string) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  async function run() {
    abortRef.current = false;
    setAgentStates(["idle", "idle", "idle"]);
    setAgentOutputs(["", "", ""]);
    setStreamLog([]);
    setGlobalState("running");

    const data = demoData;

    for (const bootLine of data.log.slice(0, 4)) {
      if (abortRef.current) return;
      await sleep(250);
      setStreamLog((s) => [...s, bootLine]);
    }

    const agentLogChunks = splitAgentLogs(data.log, 4);

    for (let i = 0; i < 3; i++) {
      if (abortRef.current) return;

      setAgentStates((s) => {
        const next = [...s];
        next[i] = "running";
        return next;
      });

      const agentLogs = agentLogChunks[i] ?? [];
      for (const line of agentLogs) {
        if (abortRef.current) return;
        await sleep(220);
        setStreamLog((s) => [...s, line]);
      }

      await sleep(300);

      const output = data.agentOutputs[i].output;
      const lines = output.split("\n");
      for (let j = 0; j < lines.length; j++) {
        if (abortRef.current) return;
        await sleep(25);
        const lineText = lines[j];
        setAgentOutputs((s) => {
          const next = [...s];
          next[i] = next[i] + (j > 0 ? "\n" : "") + lineText;
          return next;
        });
      }

      setAgentStates((s) => {
        const next = [...s];
        next[i] = "done";
        return next;
      });

      await sleep(400);
    }

    const finalLine = data.log[data.log.length - 1];
    setStreamLog((s) => [...s, finalLine]);
    setGlobalState("done");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <span
          className="font-headline font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-sm border"
          style={{ borderColor: meta.accent, color: meta.accent }}
        >
          3-AGENT SEQUENTIAL PIPELINE
        </span>
        <span className="font-code text-[10px] text-gray3 uppercase tracking-widest">
          STRUCTURED OUTPUT + GUARDRAILS
        </span>
      </div>

      <TerminalWindow
        title={`# INPUT_PROMPT // ${project.codename}`}
        rightLabel="K8S_ERROR_LOG"
        accent={meta.accent}
        bodyClassName="space-y-5"
      >
        <InputPrompt
          schema={project.inputSchema}
          values={values}
          onChange={setField}
          disabled={globalState === "running"}
          accent={meta.accent}
        />

        <div className="pt-3 border-t border-hairline flex items-center justify-between">
          <span className="font-code text-xs text-gray3">
            <span style={{ color: meta.accent }}>system@agent-archive:~$</span>{" "}
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
              {globalState === "running" ? "RUNNING..." : "RUN DEMO"}
            </button>
          </div>
        </div>
      </TerminalWindow>

      <div className="space-y-6">
        {AGENTS.map((agent, i) => {
          const agentData = demoData.agentOutputs[i];
          return (
            <AgentPanel
              key={agent.key}
              num={agent.num}
              label={agent.label}
              state={agentStates[i]}
              output={agentOutputs[i]}
              accent={meta.accent}
              isJson={i === 0}
              tools={agentData?.tools ?? []}
              context={agentData?.context}
            />
          );
        })}
      </div>

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
              [STREAM] No active execution. Trigger a run to populate the log.
            </p>
          ) : (
            <div className="space-y-1.5">
              {streamLog.map((line, i) => (
                <div key={i} className="font-code text-xs flex gap-3 animate-log-in">
                  <span className="text-gray3 shrink-0">
                    [{(i * 0.4).toFixed(2).padStart(5, "0")}]
                  </span>
                  {line.tag && (
                    <span className="font-bold shrink-0" style={{ color: tagColor(line.tag, meta.accent) }}>
                      [{line.tag}]
                    </span>
                  )}
                  <span className="text-gray2 break-words">{line.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolIcon({ name }: { name: string }) {
  if (name === "FileReadTool") return <FileText className="w-3 h-3" />;
  if (name === "EXASearchTool") return <Search className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
}

function AgentPanel({
  num,
  label,
  state,
  output,
  accent,
  isJson,
  tools,
  context,
}: {
  num: string;
  label: string;
  state: AgentState;
  output: string;
  accent: string;
  isJson: boolean;
  tools: ToolCall[];
  context?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "running") {
      ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
    }
  }, [output, state]);

  const statusColor =
    state === "running" ? accent : state === "done" ? "#B8EF43" : "#6B6B6B";
  const statusText =
    state === "running" ? "EXECUTING" : state === "done" ? "COMPLETE" : "IDLE";

  const showMeta = state === "running" || state === "done";

  return (
    <div className="bg-terminal rounded border border-hairline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-surface">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full ${state === "running" ? "animate-pulse" : ""}`}
            style={{ backgroundColor: statusColor }}
          />
          <span className="font-code text-[11px] tracking-widest uppercase" style={{ color: accent }}>
            AGENT_{num} // {label}
          </span>
          {tools.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              {tools.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 font-code text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-hairline bg-night text-gray2"
                >
                  <ToolIcon name={t.tool} />
                  {t.tool}
                </span>
              ))}
            </div>
          )}
          {tools.length === 0 && context && context.length > 0 && (
            <span className="inline-flex items-center gap-1 font-code text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-hairline bg-night text-gray2 ml-2">
              <Link2 className="w-3 h-3" />
              CONTEXT ONLY
            </span>
          )}
        </div>
        <span
          className="font-code text-[10px] tracking-widest uppercase"
          style={{ color: statusColor }}
        >
          {statusText}
        </span>
      </div>

      {showMeta && (tools.length > 0 || (context && context.length > 0)) && (
        <div className="px-4 py-3 border-b border-hairline bg-night/40 space-y-2.5">
          {context && context.length > 0 && (
            <div className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-gray3 mt-0.5 shrink-0" />
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
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-hairline" style={{ backgroundColor: `${accent}08` }}>
                <ToolIcon name={t.tool} />
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

      <div ref={ref} className="p-4 min-h-[100px] max-h-[400px] overflow-auto">
        {state === "idle" && !output && (
          <p className="font-code text-sm text-gray3">
            [IDLE] Waiting for pipeline execution...
          </p>
        )}
        {state === "running" && !output && (
          <div className="space-y-2">
            <div className="h-3 w-3/4 bg-surface rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-surface rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-surface rounded animate-pulse" />
          </div>
        )}
        {output && (
          <>
            <div className="font-headline text-[9px] tracking-widest uppercase font-bold text-gray3 mb-2">
              AGENT_OUTPUT:
            </div>
            <pre className="font-code text-sm whitespace-pre-wrap leading-relaxed" style={{ color: isJson ? "#B8EF43" : undefined }}>
              {output}
              {state === "running" && <span className="terminal-cursor" />}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}

function splitAgentLogs(allLogs: LogLine[], bootCount: number): LogLine[][] {
  const agentLogs = allLogs.slice(bootCount, -1);
  const chunks: LogLine[][] = [[], [], []];
  let current = 0;
  for (const line of agentLogs) {
    if (line.tag === "BOOT" && line.text.includes("Agent")) {
      const match = line.text.match(/Agent (\d)/);
      if (match) {
        current = parseInt(match[1], 10) - 1;
      }
    }
    if (current >= 0 && current < 3) {
      chunks[current].push(line);
    }
  }
  return chunks;
}

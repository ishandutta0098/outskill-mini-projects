"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { LogLine, ProjectDef } from "@/lib/projects/schema";
import { runProject } from "@/lib/projects/runner";
import { TIERS } from "@/lib/projects/tiers";
import { InputPrompt } from "@/components/Terminal/InputPrompt";
import { ExecutionStage, type StageState } from "@/components/Terminal/ExecutionStage";
import { TerminalWindow } from "@/components/Terminal/Window";

export function DemoPlayground({ project }: { project: ProjectDef }) {
  const meta = TIERS[project.tier];
  const [values, setValues] = useState<Record<string, string>>(project.fixture.input);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [output, setOutput] = useState("");
  const [state, setState] = useState<StageState>("idle");
  const [streamLog, setStreamLog] = useState<LogLine[]>([]);

  useEffect(() => {
    setValues(project.fixture.input);
    setLogs([]);
    setOutput("");
    setStreamLog([]);
    setState("idle");
  }, [project.slug, project.fixture.input]);

  function setField(key: string, v: string) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  async function run() {
    setLogs([]);
    setOutput("");
    setStreamLog([]);
    setState("running");
    await runProject(project, values, {
      onLog: (line) => {
        setLogs((s) => [...s, line]);
        setStreamLog((s) => [...s, line]);
      },
      onOutputChunk: (chunk) => {
        setOutput((s) => s + chunk);
      },
      onDone: () => {
        setState("done");
        setStreamLog((s) => [
          ...s,
          { tag: "SUCCESS", text: `[${project.codename}] pipeline finished` },
        ]);
      },
    });
  }

  function reset() {
    setLogs([]);
    setOutput("");
    setStreamLog([]);
    setState("idle");
    setValues(project.fixture.input);
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <TerminalWindow
          title={`# INPUT_PROMPT // ${project.codename}`}
          rightLabel={`SCHEMA: V.1.0`}
          accent={meta.accent}
          bodyClassName="space-y-5"
        >
          <InputPrompt
            schema={project.inputSchema}
            values={values}
            onChange={setField}
            disabled={state === "running"}
            accent={meta.accent}
          />

          <div className="pt-3 border-t border-hairline flex items-center justify-between">
            <span className="font-code text-xs text-gray3">
              <span style={{ color: meta.accent }}>system@agent-archive:~$</span>{" "}
              {state === "idle" ? <span className="terminal-cursor" /> : null}
            </span>

            <div className="flex items-center gap-2">
              {state !== "idle" ? (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 bg-transparent border border-hairline text-gray2 font-headline font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-surface-hover hover:text-ink transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET
                </button>
              ) : null}
              <button
                onClick={run}
                disabled={state === "running"}
                className="inline-flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
                style={{ backgroundColor: meta.accent, color: "#08090A" }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {state === "running" ? "RUNNING..." : "RUN DEMO"}
              </button>
            </div>
          </div>
        </TerminalWindow>

        <ExecutionStage
          state={state}
          logs={logs}
          output={output}
          accent={meta.accent}
          emptyText="[IDLE] Awaiting input. Press RUN DEMO to initialize the pipeline."
        />
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
        <div className="p-5 max-h-48 overflow-auto">
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
                  {line.tag ? (
                    <span
                      className="font-bold shrink-0"
                      style={{
                        color:
                          line.tag === "OK" || line.tag === "SUCCESS"
                            ? "#B8EF43"
                            : line.tag === "WARN"
                            ? "#FFD166"
                            : line.tag === "ERROR"
                            ? "#FF5F57"
                            : line.tag === "INFO"
                            ? "#00FFFF"
                            : line.tag === "PROCESS"
                            ? meta.accent
                            : "#A0A0A0",
                      }}
                    >
                      [{line.tag}]
                    </span>
                  ) : null}
                  <span className="text-gray2 break-words">{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

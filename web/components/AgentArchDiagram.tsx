import { ArrowDown, ArrowRight, Cpu, FileText, MessageSquare, Settings, Zap } from "lucide-react";

function Node({
  label,
  accent,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
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

function Connector({ direction = "down" }: { direction?: "down" | "right" }) {
  return direction === "down" ? (
    <div className="flex justify-center py-1">
      <ArrowDown className="w-4 h-4 text-gray3" />
    </div>
  ) : (
    <ArrowRight className="w-4 h-4 text-gray3 shrink-0" />
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

export function AgentArchDiagram({ accent }: { accent: string }) {
  return (
    <div className="bg-surface rounded border border-hairline p-6">
      <div className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3 mb-6">
        SYSTEM_ARCHITECTURE // CREWAI_SINGLE_AGENT_PIPELINE
      </div>

      <div className="flex flex-col items-center gap-0 max-w-3xl mx-auto">
        {/* INPUT */}
        <Node label="INPUT" accent={accent} icon={MessageSquare} className="w-full max-w-md">
          <KV k="field" v="text (textarea)" accent={accent} />
          <div className="font-code text-[11px] text-gray2 leading-snug mt-1">
            Raw text string to analyze for hate speech or offensive language
          </div>
        </Node>

        <Connector />

        {/* CREW */}
        <Node label="CREW" accent={accent} icon={Settings} className="w-full max-w-md">
          <KV k="agents" v="[hate_speech_detector]" accent={accent} />
          <KV k="tasks" v="[hate_speech_detection_task]" accent={accent} />
          <KV k="verbose" v="false" accent={accent} />
          <div className="font-code text-[11px] text-gray3 mt-1">
            crew.kickoff(inputs=&#123;&quot;text&quot;: Text&#125;)
          </div>
        </Node>

        <Connector />

        {/* AGENT + LLM side by side */}
        <div className="w-full max-w-2xl grid md:grid-cols-5 gap-3 items-start">
          <div className="md:col-span-3">
            <Node label="AGENT" accent={accent} icon={Cpu} className="w-full">
              <KV k="role" v="Hate Speech Detector" accent={accent} />
              <KV k="goal" v="Analyze text and identify hate speech" accent={accent} />
              <div className="font-code text-[11px] text-gray2 leading-snug mt-1.5 border-t border-hairline pt-1.5">
                <span className="text-gray3">backstory: </span>
                &quot;You are a Hate Speech Detector for Twitter who understands details very well...&quot;
              </div>
            </Node>
          </div>

          <div className="flex items-center justify-center md:col-span-0 self-center">
            <Connector direction="right" />
          </div>

          <div className="md:col-span-1">
            <Node label="LLM" accent={accent} icon={Zap} className="w-full">
              <KV k="model" v="gpt-4o" accent={accent} />
              <KV k="provider" v="OpenRouter" accent={accent} />
            </Node>
          </div>
        </div>

        <Connector />

        {/* TASK */}
        <Node label="TASK" accent={accent} icon={FileText} className="w-full max-w-md">
          <div className="font-code text-[11px] text-gray2 leading-snug">
            <span className="text-gray3">description: </span>
            5-step analysis pipeline
          </div>
          <div className="grid grid-cols-1 gap-1 mt-2 pl-3 border-l-2" style={{ borderColor: `${accent}40` }}>
            <div className="font-code text-[10px] text-gray2">1. Read text carefully</div>
            <div className="font-code text-[10px] text-gray2">2. Identify targeting language</div>
            <div className="font-code text-[10px] text-gray2">3. Look for threats / dehumanizing language</div>
            <div className="font-code text-[10px] text-gray2">4. Evaluate context</div>
            <div className="font-code text-[10px] text-gray2">5. Make objective classification</div>
          </div>
          <div className="font-code text-[11px] text-gray3 mt-2">
            expected_output: structured analysis
          </div>
        </Node>

        <Connector />

        {/* OUTPUT */}
        <div
          className="w-full max-w-md bg-night border rounded-sm overflow-hidden"
          style={{ borderColor: `${accent}60` }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 border-b"
            style={{ backgroundColor: `${accent}15`, borderColor: `${accent}40` }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: accent }} />
            <span
              className="font-code text-[10px] tracking-widest uppercase font-bold"
              style={{ color: accent }}
            >
              STRUCTURED OUTPUT
            </span>
          </div>
          <div className="px-3 py-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <KV k="classification" v="hate speech | no hate speech" accent={accent} />
              <KV k="confidence" v="high | medium | low" accent={accent} />
              <KV k="targeted_group" v="race, gender, ..." accent={accent} />
              <KV k="key_phrases" v="[extracted phrases]" accent={accent} />
            </div>
            <div className="mt-2 pt-2 border-t border-hairline">
              <KV k="reasoning" v="2-3 sentence explanation" accent={accent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroBand } from "@/components/HeroBand";
import { TierCard } from "@/components/TierCard";
import { TerminalWindow } from "@/components/Terminal/Window";
import { TIER_ORDER } from "@/lib/projects/tiers";
import { totalProjects } from "@/lib/projects/registry";

export default function HomePage() {
  return (
    <>
      <HeroBand />

      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-6xl">
          <div className="flex items-end justify-between mb-3 pb-6 border-b border-hairline">
            <div>
              <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-3">
                /ARCHIVE_STRUCTURE
              </p>
              <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase tracking-tighter">
                PROJECT TIERS
              </h2>
            </div>
            <p className="font-code text-xs text-gray3 uppercase tracking-widest hidden md:block">
              {String(totalProjects()).padStart(2, "0")}_TOTAL_AGENTS
            </p>
          </div>

          <p className="font-body text-gray2 max-w-3xl mt-6 mb-10">
            Three tiers indexing thirty CrewAI mini-projects. Each agent ships with a hardcoded
            demo today and a real backend endpoint reserved for tomorrow.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIER_ORDER.map((t) => (
              <TierCard key={t} tier={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-hairline grid lg:grid-cols-2 min-h-[480px]">
        <div className="relative stage-bg flex items-center justify-center p-10 border-r border-hairline">
          <div className="w-full max-w-md">
            <TerminalWindow
              title="agent-archive // boot.sh"
              rightLabel="SESSION_ID: 0x82FB4"
              accent="#B8EF43"
              bodyClassName="space-y-2 min-h-[260px]"
            >
              <div className="text-gray3">
                <span className="text-volt">$</span> deploy_agent --tier advanced --slug
                hiring-pipeline
              </div>
              <div className="text-cyan">[INFO] booting orchestration runtime</div>
              <div className="text-cyan">[INFO] loading 4 agents</div>
              <div className="text-volt">[OK]   Profile Builder online</div>
              <div className="text-volt">[OK]   Job Matcher online</div>
              <div className="text-volt">[OK]   Screening Briefer online</div>
              <div className="text-volt">[OK]   Outreach Writer online</div>
              <div className="text-gray3">[STREAM] piping resume into pipeline...</div>
              <div className="text-ink">
                <span className="text-volt">system@agent-archive:~$</span>{" "}
                <span className="terminal-cursor" />
              </div>
            </TerminalWindow>
          </div>
        </div>

        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-4">
            /WHY_THIS_EXISTS
          </p>
          <h3 className="font-headline text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-6">
            BUILT FOR <span className="text-volt">AUTONOMOUS</span> EXCELLENCE
          </h3>
          <p className="font-body text-gray2 mb-8 max-w-lg leading-relaxed">
            The archive is the playable companion to a working repo. Every demo on the site maps
            to a CrewAI pipeline shipped as Python under <span className="font-code text-ink">projects/</span>.
            Run hardcoded today, point at a live FastAPI tomorrow.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              "30 working CrewAI pipelines indexed by difficulty",
              "Backend-pluggable via NEXT_PUBLIC_USE_REAL_BACKEND",
              "Typed I/O contracts you can copy straight into prod",
              "No hidden state - every demo is reproducible",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-volt shrink-0 mt-0.5" />
                <span className="font-body text-sm text-ink">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/beginner"
            className="inline-flex items-center gap-2 self-start bg-volt font-headline font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-sm hover:brightness-110 active:scale-95 transition-all"
            style={{ color: "#08090A" }}
          >
            LEARN MORE
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import type { Tier } from "@/lib/projects/schema";
import { TIERS, TIER_ORDER } from "@/lib/projects/tiers";
import { projectsByTier } from "@/lib/projects/registry";
import { TierBadge } from "@/components/TierBadge";
import { ProjectCard } from "@/components/ProjectCard";
import { TerminalWindow } from "@/components/Terminal/Window";

export function generateStaticParams() {
  return TIER_ORDER.map((tier) => ({ tier }));
}

const VALID = new Set(TIER_ORDER);

export default async function TierPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;
  if (!VALID.has(tier as Tier)) notFound();
  const tierId = tier as Tier;
  const meta = TIERS[tierId];
  const projects = projectsByTier(tierId);
  const featured = projects[0];

  return (
    <>
      <section
        className="relative border-b border-hairline px-6 lg:px-12 py-16 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, rgba(${meta.accentRgb},0.08) 0%, transparent 60%)`,
        }}
      >
        <div className="absolute inset-0 stage-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-6xl">
          <div className="flex items-center gap-3 mb-6 font-code text-xs text-gray3 uppercase tracking-widest">
            <Link href="/" className="hover:text-ink transition-colors">
              OVERVIEW
            </Link>
            <span>/</span>
            <span style={{ color: meta.accent }}>{meta.label.toUpperCase()}</span>
          </div>

          <TierBadge tier={tierId} label={meta.module} />

          <h1
            className="font-headline text-5xl md:text-7xl font-bold tracking-tighter uppercase mt-6 mb-6"
            style={{ color: meta.accent }}
          >
            {meta.title}
          </h1>

          <p className="font-body text-lg text-gray2 max-w-3xl leading-relaxed">
            {meta.blurb}
          </p>

          <div className="flex items-center gap-6 mt-8 font-code text-xs uppercase tracking-widest text-gray3">
            <span>
              <span style={{ color: meta.accent }}>{String(projects.length).padStart(2, "0")}</span>{" "}
              AGENTS
            </span>
            <span>STATUS: <span className="text-volt">OPERATIONAL</span></span>
            <span>SCHEMA: V.1.0</span>
          </div>
        </div>
      </section>

      {tierId !== "beginner" && featured ? (
        <section className="border-b border-hairline px-6 lg:px-12 py-14">
          <div className="max-w-6xl">
            <div className="flex items-end justify-between mb-6 pb-6 border-b border-hairline">
              <div>
                <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-2">
                  /FEATURED_AGENT
                </p>
                <h2 className="font-headline text-3xl font-bold uppercase tracking-tighter">
                  {featured.codename}
                </h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <Link
                href={`/${tierId}/${featured.slug}`}
                className="lg:col-span-2 group bg-surface border border-hairline rounded p-6 flex flex-col gap-5 transition-all hover:-translate-y-1"
                style={{ boxShadow: `inset 0 0 0 1px transparent` }}
              >
                <div
                  className="h-40 rounded-sm border border-hairline relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 20% 30%, ${meta.accent}25 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${meta.accent}20 0%, transparent 50%)`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div
                    className="absolute bottom-3 left-3 font-headline text-3xl font-bold uppercase tracking-tighter"
                    style={{ color: meta.accent }}
                  >
                    {featured.number}
                  </div>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-ink mb-2">
                    {featured.title}
                  </h3>
                  <p className="font-body text-sm text-gray2 leading-relaxed">
                    {featured.blurb}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-code text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm bg-night border border-hairline text-gray3"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between font-headline text-xs uppercase tracking-widest font-bold pt-4 border-t border-hairline"
                  style={{ color: meta.accent }}
                >
                  <span>RUN FEATURED DEMO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <div className="lg:col-span-3">
                <TerminalWindow
                  title={`agent_log // ${featured.slug}`}
                  rightLabel="STREAM_LIVE"
                  accent={meta.accent}
                  bodyClassName="space-y-1.5 min-h-[360px]"
                >
                  {featured.fixture.log.map((line, i) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <span className="text-gray3">[0:{(i * 0.4).toFixed(2).padStart(5, "0")}]</span>
                      {line.tag ? (
                        <span
                          className="font-bold"
                          style={{
                            color:
                              line.tag === "OK" || line.tag === "SUCCESS"
                                ? "#B8EF43"
                                : line.tag === "WARN"
                                ? "#FFD166"
                                : line.tag === "PROCESS"
                                ? meta.accent
                                : "#A0A0A0",
                          }}
                        >
                          [{line.tag}]
                        </span>
                      ) : null}
                      <span className="text-gray2">{line.text}</span>
                    </div>
                  ))}
                  <div className="text-ink pt-2">
                    <span style={{ color: meta.accent }}>system@agent-archive:~$</span>{" "}
                    <span className="terminal-cursor" />
                  </div>
                </TerminalWindow>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-6 lg:px-12 py-14">
        <div className="max-w-6xl">
          <div className="flex items-end justify-between mb-8 pb-6 border-b border-hairline">
            <div>
              <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-2">
                /AGENT_INDEX
              </p>
              <h2 className="font-headline text-3xl font-bold uppercase tracking-tighter">
                ALL AGENTS
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(tierId === "beginner" ? projects : projects.slice(1)).map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline px-6 lg:px-12 py-14">
        <div className="max-w-6xl">
          <div className="bg-surface rounded border border-hairline overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-hairline bg-night">
              <div className="flex items-center gap-3">
                <TerminalIcon className="w-4 h-4" style={{ color: meta.accent }} />
                <span
                  className="font-code text-[11px] tracking-widest uppercase"
                  style={{ color: meta.accent }}
                >
                  DEMO_ENVIRONMENT // STATUS: IDLE
                </span>
              </div>
              <span className="font-code text-[10px] tracking-widest uppercase text-gray3">
                SESSION_ID: 0x82FB4
              </span>
            </div>

            <div className="grid md:grid-cols-2 divide-x divide-hairline">
              <div className="bg-terminal p-6">
                <div className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3 mb-4">
                  # INPUT_PROMPT
                </div>
                {featured ? (
                  <div className="font-code text-xs leading-relaxed space-y-2">
                    <div className="text-ink">
                      <span style={{ color: meta.accent }}>{">>>"}</span> input.
                      {featured.inputSchema[0].key} ={" "}
                      <span className="text-gray2">
                        &quot;
                        {(featured.fixture.input[featured.inputSchema[0].key] ?? "").slice(0, 90)}
                        {(featured.fixture.input[featured.inputSchema[0].key] ?? "").length > 90
                          ? "..."
                          : ""}
                        &quot;
                      </span>
                    </div>
                    <div className="text-gray3 pt-3"># SYSTEM_PROMPT</div>
                    <div className="text-gray2">
                      You are{" "}
                      <span className="text-cyan">{featured.codename}</span> running tier{" "}
                      <span style={{ color: meta.accent }}>{tierId.toUpperCase()}</span>.
                    </div>
                    <div className="text-gray2">
                      Pipeline: {featured.pipeline.join(" -> ")}.
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 text-xs text-gray3 font-code">
                  <span style={{ color: meta.accent }}>system@agent-archive:~$</span>{" "}
                  <span className="terminal-cursor" />
                </div>
              </div>

              <div className="bg-night stage-bg p-6 relative">
                <div className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3 mb-4">
                  EXECUTION STAGE
                </div>
                <div className="space-y-1.5 font-code text-xs">
                  {(featured?.fixture.log.slice(0, 4) ?? []).map((line, i) => (
                    <div key={i} className="flex gap-2">
                      {line.tag ? (
                        <span
                          className="font-bold shrink-0"
                          style={{
                            color:
                              line.tag === "OK" || line.tag === "SUCCESS"
                                ? "#B8EF43"
                                : line.tag === "INFO"
                                ? "#00FFFF"
                                : line.tag === "WARN"
                                ? "#FFD166"
                                : line.tag === "PROCESS"
                                ? meta.accent
                                : "#A0A0A0",
                          }}
                        >
                          [{line.tag}]
                        </span>
                      ) : null}
                      <span className="text-gray2">{line.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-hairline">
                  <pre className="font-code text-xs text-ink whitespace-pre-wrap leading-relaxed">
                    {(featured?.fixture.output ?? "").split("\n").slice(0, 6).join("\n")}
                  </pre>
                </div>
                {featured ? (
                  <Link
                    href={`/${tierId}/${featured.slug}`}
                    className="absolute bottom-5 right-5 inline-flex items-center gap-2 font-headline text-xs uppercase tracking-widest font-bold transition-colors"
                    style={{ color: meta.accent }}
                  >
                    OPEN FULL DEMO
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

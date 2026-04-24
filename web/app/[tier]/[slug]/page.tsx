import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, ExternalLink } from "lucide-react";
import type { Tier } from "@/lib/projects/schema";
import { TIERS, TIER_ORDER } from "@/lib/projects/tiers";
import { findProject, PROJECTS } from "@/lib/projects/registry";
import { StatusChip } from "@/components/StatusChip";
import { TierBadge } from "@/components/TierBadge";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { AgentArchDiagram } from "@/components/AgentArchDiagram";
import { DemoPlayground } from "@/components/DemoPlayground";
import { MultiAgentDemoPlayground } from "@/components/MultiAgentDemoPlayground";

const VALID = new Set(TIER_ORDER);

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ tier: p.tier, slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ tier: string; slug: string }>;
}) {
  const { tier, slug } = await params;
  if (!VALID.has(tier as Tier)) notFound();
  const tierId = tier as Tier;
  const project = findProject(tierId, slug);
  if (!project) notFound();
  const meta = TIERS[tierId];

  return (
    <>
      <section
        className="relative border-b border-hairline px-6 lg:px-12 py-12 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 90% 10%, rgba(${meta.accentRgb},0.08) 0%, transparent 60%)`,
        }}
      >
        <div className="absolute inset-0 stage-bg opacity-10 pointer-events-none" />
        <div className="relative max-w-6xl">
          <div className="flex items-center gap-3 mb-6 font-code text-xs text-gray3 uppercase tracking-widest">
            <Link href="/" className="hover:text-ink transition-colors">
              OVERVIEW
            </Link>
            <span>/</span>
            <Link
              href={`/${tierId}`}
              className="hover:text-ink transition-colors"
            >
              {meta.label.toUpperCase()}
            </Link>
            <span>/</span>
            <span style={{ color: meta.accent }}>{project.codename}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <TierBadge tier={tierId} />
            <StatusChip status={project.status} />
            <span className="font-code text-xs text-gray3 uppercase tracking-widest">
              {project.number}_/_{project.tier.toUpperCase()}
            </span>
          </div>

          <h1
            className="font-headline text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6"
            style={{ color: meta.accent }}
          >
            {project.title}
          </h1>

          <p className="font-body text-lg text-gray2 max-w-3xl leading-relaxed">
            {project.blurb}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-code text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm bg-surface border border-hairline text-gray2"
              >
                {tag}
              </span>
            ))}
            <a
              href={`https://github.com/outskill/agent-archive/tree/main/projects/${tierId}/${project.number}_${project.slug.replace(/-/g, "_")}`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-widest text-gray3 hover:text-ink transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              VIEW SOURCE
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-10">
        <div className="max-w-6xl">
          {project.slug === "devops-log-analyzer" ? (
            <MultiAgentDemoPlayground project={project} />
          ) : (
            <DemoPlayground project={project} />
          )}
        </div>
      </section>

      <section className="px-6 lg:px-12 py-10 border-t border-hairline">
        <div className="max-w-6xl space-y-6">
          <div>
            <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-3">
              /SYSTEM_INTERNALS
            </p>
            <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
              ARCHITECTURE
            </h2>
          </div>
          {project.slug === "hate-speech-detector" ? (
            <AgentArchDiagram accent={meta.accent} />
          ) : (
            <PipelineDiagram steps={project.pipeline} accent={meta.accent} />
          )}
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-16">
        <div className="max-w-6xl">
          <div className="bg-surface rounded border border-hairline p-6 grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-3">
                /BACKEND_CONTRACT
              </p>
              <h3 className="font-headline text-lg font-bold uppercase tracking-tight mb-3 text-ink">
                PLUGGABLE RUNTIME
              </h3>
              <p className="font-body text-sm text-gray2 leading-relaxed">
                This demo serves a hardcoded fixture today. Set{" "}
                <span className="font-code text-ink">
                  NEXT_PUBLIC_USE_REAL_BACKEND=true
                </span>{" "}
                and the same UI will POST{" "}
                <span className="font-code text-ink">{project.endpoint}</span> to a real
                CrewAI service - no UI change required.
              </p>
            </div>
            <div>
              <p className="font-code text-xs text-gray3 uppercase tracking-widest mb-3">
                /TYPED_INTERFACE
              </p>
              <pre className="font-code text-xs text-ink bg-night border border-hairline rounded-sm p-3 overflow-auto">
{`runProject(${project.codename}, {
${project.inputSchema
  .map((f) => `  ${f.key}: string,`)
  .join("\n")}
}) -> ${project.outputType}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

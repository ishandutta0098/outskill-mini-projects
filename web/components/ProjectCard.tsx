import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectDef } from "@/lib/projects/schema";
import { TIERS } from "@/lib/projects/tiers";
import { StatusChip } from "./StatusChip";

export function ProjectCard({ project }: { project: ProjectDef }) {
  const meta = TIERS[project.tier];
  return (
    <Link
      href={`/${project.tier}/${project.slug}`}
      className="group relative bg-surface border border-hairline rounded p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-2"
    >
      <span
        className="absolute inset-0 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 0 1px ${meta.accent}, 0 12px 40px -12px ${meta.accent}40`,
        }}
      />

      <div
        className="relative h-32 rounded-sm overflow-hidden border border-hairline"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <div
          className="absolute inset-0 transition-all duration-500 grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${meta.accent}30 0%, transparent 60%), radial-gradient(circle at 80% 80%, ${meta.accent}25 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute top-3 left-3 font-code text-[10px] tracking-widest text-gray3">
          {project.number}_/_{project.tier.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className="font-headline text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-sm border"
            style={{
              color: meta.accent,
              backgroundColor: `rgba(${meta.accentRgb},0.15)`,
              borderColor: `rgba(${meta.accentRgb},0.4)`,
            }}
          >
            ACTIVE
          </span>
        </div>
        <div
          className="absolute bottom-3 left-3 font-headline text-2xl font-bold uppercase tracking-tight"
          style={{ color: meta.accent }}
        >
          {project.codename.split("_")[0]}
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-headline font-bold uppercase tracking-tight text-ink">
          {project.title}
        </h3>
        <p className="font-body text-sm text-gray2 leading-relaxed line-clamp-3">
          {project.blurb}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-hairline">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-code text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm bg-night border border-hairline text-gray3"
            >
              {tag}
            </span>
          ))}
        </div>
        <StatusChip status={project.status} />
      </div>

      <div
        className="flex items-center justify-between font-headline text-xs uppercase tracking-widest font-bold pt-1 transition-colors"
        style={{ color: meta.accent }}
      >
        <span>RUN DEMO</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

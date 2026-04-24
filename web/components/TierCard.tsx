import Link from "next/link";
import { GraduationCap, Brain, Bot, ArrowRight } from "lucide-react";
import { TIERS } from "@/lib/projects/tiers";
import { projectsByTier } from "@/lib/projects/registry";
import type { Tier } from "@/lib/projects/schema";

const TIER_ICON = {
  school: GraduationCap,
  psychology: Brain,
  precision: Bot,
} as const;

export function TierCard({ tier }: { tier: Tier }) {
  const meta = TIERS[tier];
  const count = projectsByTier(tier).length;
  const Icon = TIER_ICON[meta.iconKey];

  return (
    <Link
      href={`/${tier}`}
      className="group relative bg-surface border border-hairline rounded p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-2"
      style={{
        ["--tier-accent" as string]: meta.accent,
        ["--tier-accent-rgb" as string]: meta.accentRgb,
      }}
    >
      <span
        className="absolute inset-0 rounded pointer-events-none transition-all duration-300"
        style={{
          boxShadow: `0 0 0 1px transparent`,
        }}
      />
      <span
        className="absolute inset-0 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 0 1px ${meta.accent}, 0 12px 40px -12px ${meta.accent}40`,
        }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded flex items-center justify-center border"
          style={{
            backgroundColor: `rgba(${meta.accentRgb},0.1)`,
            borderColor: `rgba(${meta.accentRgb},0.3)`,
            color: meta.accent,
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <span
          className="font-headline text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-sm border"
          style={{
            color: meta.accent,
            backgroundColor: `rgba(${meta.accentRgb},0.1)`,
            borderColor: `rgba(${meta.accentRgb},0.3)`,
          }}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-code text-xs text-gray3 uppercase tracking-widest">
          {String(count).padStart(2, "0")}_PROJECTS
        </p>
        <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-ink">
          {meta.codename}
        </h3>
        <p className="font-body text-sm text-gray2 leading-relaxed">{meta.blurb}</p>
      </div>

      <div className="relative h-12 overflow-hidden rounded-sm border border-hairline mt-2">
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${meta.accentRgb},0.18) 50%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      <div
        className="flex items-center justify-between font-headline text-xs uppercase tracking-widest font-bold pt-1 transition-colors duration-300"
        style={{ color: meta.accent }}
      >
        <span>ENTER ARCHIVE</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

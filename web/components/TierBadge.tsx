import { TIERS } from "@/lib/projects/tiers";
import type { Tier } from "@/lib/projects/schema";

export function TierBadge({ tier, label }: { tier: Tier; label?: string }) {
  const meta = TIERS[tier];
  return (
    <span
      className="inline-flex items-center font-headline text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-sm border"
      style={{
        color: meta.accent,
        backgroundColor: `rgba(${meta.accentRgb},0.1)`,
        borderColor: `rgba(${meta.accentRgb},0.3)`,
      }}
    >
      {label ?? meta.label}
    </span>
  );
}

import type { Status } from "@/lib/projects/schema";

const STYLES: Record<Status, { color: string; bg: string; border: string }> = {
  stable: { color: "#B8EF43", bg: "rgba(184,239,67,0.1)", border: "rgba(184,239,67,0.3)" },
  experimental: { color: "#FFD166", bg: "rgba(255,209,102,0.1)", border: "rgba(255,209,102,0.3)" },
  deployed: { color: "#00FFFF", bg: "rgba(0,255,255,0.1)", border: "rgba(0,255,255,0.3)" },
};

export function StatusChip({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-headline text-[10px] tracking-widest uppercase font-bold px-2 py-1 rounded-sm border"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: s.color }}
      />
      {status}
    </span>
  );
}

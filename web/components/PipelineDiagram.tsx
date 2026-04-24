import { ChevronRight } from "lucide-react";

export function PipelineDiagram({
  steps,
  accent,
}: {
  steps: string[];
  accent: string;
}) {
  return (
    <div className="bg-surface rounded border border-hairline p-6">
      <div className="font-headline text-[10px] tracking-widest uppercase font-bold text-gray3 mb-5">
        SYSTEM_ARCHITECTURE
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {steps.map((step, i) => (
          <div key={`${step}-${i}`} className="flex items-center gap-3">
            <div
              className="px-4 py-3 bg-night border rounded-sm font-code text-xs uppercase tracking-widest"
              style={{
                borderColor: `rgba(${accent === "#B8EF43" ? "184,239,67" : accent === "#00FFFF" ? "0,255,255" : "255,0,255"},0.4)`,
                color: accent,
              }}
            >
              <span className="text-gray3 mr-2">[{String(i + 1).padStart(2, "0")}]</span>
              {step}
            </div>
            {i < steps.length - 1 ? (
              <ChevronRight className="w-4 h-4 text-gray3 shrink-0" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

export function HeroBand() {
  return (
    <section className="relative border-b border-hairline overflow-hidden">
      <div className="absolute inset-0 stage-bg opacity-20 pointer-events-none" />
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right, rgba(184,239,67,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative px-6 lg:px-12 py-20 lg:py-28 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-volt" />
          </span>
          <span className="font-code text-xs text-volt uppercase tracking-widest">
            SYSTEM READY // ARCHIVE_INIT
          </span>
        </div>

        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-none mb-8">
          ENGINEERED
          <br />
          <span className="text-volt">AUTONOMOUS</span>
          <br />
          EXCELLENCE.
        </h1>

        <p className="font-body text-lg text-gray2 max-w-2xl mb-10 leading-relaxed">
          30 CrewAI mini-projects, indexed by tier. From your first resume screener to a full
          hiring pipeline - every demo runs against a typed runtime that swaps for a real backend
          with a single env flag.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/beginner"
            className="inline-flex items-center justify-center gap-2 bg-volt font-headline font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-sm hover:brightness-110 active:scale-95 transition-all"
            style={{ color: "#08090A" }}
          >
            EXPLORE THE ARCHIVE
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com"
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-hairline text-ink font-headline font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-sm hover:border-ink hover:bg-surface transition-all"
          >
            <Github className="w-4 h-4" />
            VIEW SOURCE CODE
          </a>
        </div>
      </div>
    </section>
  );
}

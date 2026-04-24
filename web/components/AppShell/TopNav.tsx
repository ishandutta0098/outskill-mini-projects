"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TerminalSquare, Settings, User } from "lucide-react";
import { TIER_ORDER, TIERS } from "@/lib/projects/tiers";

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 bg-night/80 glass-header border-b border-hairline flex items-center justify-between px-6">
      <Link
        href="/"
        className="font-headline font-bold text-volt tracking-tighter uppercase text-xl"
      >
        AGENT_ARCHIVE
      </Link>

      <div className="hidden sm:flex items-center gap-3 md:gap-6 lg:gap-8 font-headline font-medium text-xs md:text-sm">
        <Link
          href="/"
          className={
            isHome
              ? "text-volt border-b-2 border-volt pb-1 uppercase tracking-widest"
              : "text-gray3 hover:text-ink px-2 py-1 rounded transition-colors uppercase tracking-widest"
          }
        >
          Home
        </Link>
        {TIER_ORDER.map((t) => {
          const active = pathname.startsWith(`/${t}`);
          const meta = TIERS[t];
          return (
            <Link
              key={t}
              href={`/${t}`}
              className={
                active
                  ? "border-b-2 pb-1 text-ink uppercase tracking-widest"
                  : "text-gray3 hover:text-ink px-2 py-1 rounded transition-colors uppercase tracking-widest"
              }
              style={active ? { color: meta.accent, borderColor: meta.accent } : undefined}
            >
              {meta.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray3 hover:text-volt transition-colors">
          <TerminalSquare className="w-5 h-5" />
        </button>
        <button className="text-gray3 hover:text-volt transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full border border-hairline overflow-hidden bg-surface flex items-center justify-center">
          <User className="w-4 h-4 text-gray3" />
        </div>
      </div>
    </nav>
  );
}

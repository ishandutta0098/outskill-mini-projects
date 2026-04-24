"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cpu,
  LayoutDashboard,
  GraduationCap,
  Brain,
  Bot,
  BookOpen,
  Code2,
} from "lucide-react";
import { TIER_ORDER, TIERS } from "@/lib/projects/tiers";

const TIER_ICON = {
  school: GraduationCap,
  psychology: Brain,
  precision: Bot,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-night border-r border-hairline z-40 pt-20">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded bg-surface border border-hairline flex items-center justify-center">
            <Cpu className="w-5 h-5 text-volt" />
          </div>
          <div>
            <h2 className="font-headline text-volt font-bold text-sm uppercase leading-none">
              AGENT_ARCHIVE
            </h2>
            <p className="text-[10px] text-gray3 font-code mt-1">V.1.0.4-STABLE</p>
          </div>
        </div>
        <button
          className="w-full mt-4 bg-volt font-label text-label-caps py-3 rounded-sm hover:brightness-110 active:scale-95 transition-all"
          style={{ color: "#08090A" }}
        >
          DEPLOY NEW AGENT
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/"
          className={
            isHome
              ? "flex items-center gap-3 px-4 py-3 bg-surface text-volt border-r-4 border-volt font-headline text-sm uppercase font-bold transition-all"
              : "flex items-center gap-3 px-4 py-3 text-gray3 hover:text-gray2 hover:bg-surface-hover font-headline text-sm uppercase font-bold transition-all"
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Overview
        </Link>
        {TIER_ORDER.map((t) => {
          const meta = TIERS[t];
          const active = pathname.startsWith(`/${t}`);
          const Icon = TIER_ICON[meta.iconKey];
          return (
            <Link
              key={t}
              href={`/${t}`}
              className={
                active
                  ? "flex items-center gap-3 px-4 py-3 bg-surface border-r-4 font-headline text-sm uppercase font-bold transition-all"
                  : "flex items-center gap-3 px-4 py-3 text-gray3 hover:text-gray2 hover:bg-surface-hover font-headline text-sm uppercase font-bold transition-all"
              }
              style={active ? { color: meta.accent, borderColor: meta.accent } : undefined}
            >
              <Icon className="w-5 h-5" />
              {meta.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-hairline space-y-4">
        <a
          href="https://github.com"
          className="flex items-center gap-3 text-gray3 hover:text-volt font-headline text-xs tracking-widest uppercase transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Documentation
        </a>
        <a
          href="#"
          className="flex items-center gap-3 text-gray3 hover:text-volt font-headline text-xs tracking-widest uppercase transition-colors"
        >
          <Code2 className="w-4 h-4" />
          Terminal
        </a>
      </div>
    </aside>
  );
}

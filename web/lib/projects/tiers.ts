import type { Tier } from "./schema";

export type TierMeta = {
  id: Tier;
  label: string;
  codename: string;
  module: string;
  badge: string;
  title: string;
  blurb: string;
  accent: string;
  accentRgb: string;
  iconKey: "school" | "psychology" | "precision";
};

export const TIERS: Record<Tier, TierMeta> = {
  beginner: {
    id: "beginner",
    label: "Beginner",
    codename: "FOUNDATIONS",
    module: "MODULE_01: FUNDAMENTALS",
    badge: "Beginner",
    title: "Beginner Archives",
    blurb:
      "Entry-level autonomous scripts and logic gates designed for core system comprehension. Start here to master the foundation of agentic workflows.",
    accent: "#B8EF43",
    accentRgb: "184,239,67",
    iconKey: "school",
  },
  intermediate: {
    id: "intermediate",
    label: "Intermediate",
    codename: "PIPELINES",
    module: "TIER_02: INTERMEDIATE_ARCHIVE",
    badge: "Intermediate",
    title: "Architecting Logic",
    blurb:
      "Scale your autonomous capabilities with multi-agent coordination, vector-memory structures, and complex reasoning pipelines.",
    accent: "#00FFFF",
    accentRgb: "0,255,255",
    iconKey: "psychology",
  },
  advanced: {
    id: "advanced",
    label: "Advanced",
    codename: "AUTONOMOUS_SYSTEMS",
    module: "ADVANCED_TIER // SYSTEM_STATE: CRITICAL_EXECUTION",
    badge: "Advanced",
    title: "High-Level Autonomous Systems",
    blurb:
      "Experimental agents designed for recursive reasoning, large-scale data synthesis, and complex multi-modal decision making.",
    accent: "#FF00FF",
    accentRgb: "255,0,255",
    iconKey: "precision",
  },
};

export const TIER_ORDER: Tier[] = ["beginner", "intermediate", "advanced"];

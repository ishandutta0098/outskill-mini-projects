import type { ProjectDef, Tier } from "./schema";

import { project as b00 } from "./beginner/00-hate-speech-detector";
import { project as b01 } from "./beginner/01-resume-screener";
import { project as b02 } from "./beginner/02-review-sentiment";
import { project as b03 } from "./beginner/03-email-tone-rewriter";
import { project as b04 } from "./beginner/04-meeting-notes";
import { project as b05 } from "./beginner/05-cold-outreach";
import { project as b06 } from "./beginner/06-code-explainer";
import { project as b07 } from "./beginner/07-social-caption";
import { project as b08 } from "./beginner/08-legal-simplifier";
import { project as b09 } from "./beginner/09-interview-questions";
import { project as b10 } from "./beginner/10-startup-validator";

import { project as i01 } from "./intermediate/01-seo-blog-pipeline";
import { project as i02 } from "./intermediate/02-support-ticket-resolver";
import { project as i03 } from "./intermediate/03-competitor-intel";
import { project as i04 } from "./intermediate/04-lit-reviewer";
import { project as i05 } from "./intermediate/05-job-app-assistant";
import { project as i06 } from "./intermediate/06-dep-vuln-scanner";
import { project as i07 } from "./intermediate/07-launch-checklist";
import { project as i08 } from "./intermediate/08-podcast-show-notes";
import { project as i09 } from "./intermediate/09-real-estate-analyzer";
import { project as i10 } from "./intermediate/10-incident-postmortem";

import { project as a01 } from "./advanced/01-hiring-pipeline";
import { project as a02 } from "./advanced/02-news-factchecker";
import { project as a03 } from "./advanced/03-price-intel";
import { project as a04 } from "./advanced/04-crypto-advisor";
import { project as a05 } from "./advanced/05-repo-health";
import { project as a06 } from "./advanced/06-travel-planner";
import { project as a07 } from "./advanced/07-sales-intel";
import { project as a08 } from "./advanced/08-license-auditor";
import { project as a09 } from "./advanced/09-content-repurposer";
import { project as a10 } from "./advanced/10-energy-optimizer";

export const PROJECTS: ProjectDef[] = [
  b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10,
  i01, i02, i03, i04, i05, i06, i07, i08, i09, i10,
  a01, a02, a03, a04, a05, a06, a07, a08, a09, a10,
];

export function projectsByTier(tier: Tier): ProjectDef[] {
  return PROJECTS.filter((p) => p.tier === tier);
}

export function findProject(tier: Tier, slug: string): ProjectDef | undefined {
  return PROJECTS.find((p) => p.tier === tier && p.slug === slug);
}

export function totalProjects(): number {
  return PROJECTS.length;
}

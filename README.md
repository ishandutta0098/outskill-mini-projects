<div align="center">

# AGENT_ARCHIVE

**A playable archive of 30 production-shaped CrewAI mini-projects.**
Beginner → Intermediate → Advanced. Each one ships a Python pipeline _and_ a runnable web demo.

[![Live Demo](https://img.shields.io/badge/Live_Demo-outskill--mini--projects.vercel.app-B8EF43?style=for-the-badge&logo=vercel&logoColor=black)](https://outskill-mini-projects.vercel.app)
[![Repo](https://img.shields.io/badge/GitHub-outskill--mini--projects-181717?style=for-the-badge&logo=github)](https://github.com/ishandutta0098/outskill-mini-projects)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-FF6B6B?style=for-the-badge)](https://docs.crewai.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

</div>

---

## Live Site

> **[https://outskill-mini-projects.vercel.app](https://outskill-mini-projects.vercel.app)**

Every demo on the site runs against hardcoded fixtures by default — zero API credits consumed. Each project also defines an optional `endpoint` so the same UI can be flipped to a real FastAPI backend with `NEXT_PUBLIC_USE_REAL_BACKEND=true`.

---

## Browse by Tier

<table>
<tr>
<td width="33%" valign="top">

### [BEGINNER](https://outskill-mini-projects.vercel.app/beginner)
**10 single-agent pipelines**

Foundational CrewAI patterns: one agent, one task, one clean output. The fastest way to get an LLM doing something useful.

`Py 3.12` · `CrewAI` · `OpenRouter`

</td>
<td width="33%" valign="top">

### [INTERMEDIATE](https://outskill-mini-projects.vercel.app/intermediate)
**10 multi-agent crews**

Sequential and parallel crews where 2-4 agents pass structured context: research → draft → review patterns.

`Crews` · `Tools` · `EXA Search`

</td>
<td width="33%" valign="top">

### [ADVANCED](https://outskill-mini-projects.vercel.app/advanced)
**10 production pipelines**

Real tool integrations, parallel orchestration, and FastAPI surfaces. Built like things you'd actually deploy.

`FastAPI` · `Parallel` · `Live APIs`

</td>
</tr>
</table>

---

## All Agents

### Beginner — Single-Agent Pipelines

| # | Agent | What it does | Demo |
|---|---|---|---|
| 01 | **Resume Screener** | Scores a candidate resume against a job description and explains its reasoning. | [Run](https://outskill-mini-projects.vercel.app/beginner/resume-screener) |
| 02 | **Review Sentiment** | Classifies a customer review into positive, negative, or mixed and returns the top theme. | [Run](https://outskill-mini-projects.vercel.app/beginner/review-sentiment) |
| 03 | **Email Tone Rewriter** | Rewrites a draft email in a target tone while preserving the underlying ask. | [Run](https://outskill-mini-projects.vercel.app/beginner/email-tone-rewriter) |
| 04 | **Meeting Notes** | Turns a raw transcript into a tight summary, decisions list, and tagged action items. | [Run](https://outskill-mini-projects.vercel.app/beginner/meeting-notes) |
| 05 | **Cold Outreach** | Generates a short, personalized cold email tying a prospect's role to your value prop. | [Run](https://outskill-mini-projects.vercel.app/beginner/cold-outreach) |
| 06 | **Code Explainer** | Explains a code snippet in plain English with intent, control flow, and gotchas. | [Run](https://outskill-mini-projects.vercel.app/beginner/code-explainer) |
| 07 | **Social Caption** | Three platform-tailored captions for X, LinkedIn, and Instagram from one idea. | [Run](https://outskill-mini-projects.vercel.app/beginner/social-caption) |
| 08 | **Legal Simplifier** | Translates a contract clause into plain English and surfaces the top three risks. | [Run](https://outskill-mini-projects.vercel.app/beginner/legal-simplifier) |
| 09 | **Interview Questions** | Generates a balanced set of behavioral, technical, and situational interview questions. | [Run](https://outskill-mini-projects.vercel.app/beginner/interview-questions) |
| 10 | **Startup Validator** | Pressure-tests a startup idea and gives a candid go / no-go score. | [Run](https://outskill-mini-projects.vercel.app/beginner/startup-validator) |

### Intermediate — Multi-Agent Crews

| # | Agent | What it does | Demo |
|---|---|---|---|
| 01 | **SEO Blog Pipeline** | Three-agent crew that researches keywords, drafts a post, and SEO-optimizes the copy. | [Run](https://outskill-mini-projects.vercel.app/intermediate/seo-blog-pipeline) |
| 02 | **Support Ticket Resolver** | Triages a ticket, drafts a customer reply, and decides whether to escalate. | [Run](https://outskill-mini-projects.vercel.app/intermediate/support-ticket-resolver) |
| 03 | **Competitor Intel** | Crawls a competitor's site and posts to produce a positioning + pricing brief. | [Run](https://outskill-mini-projects.vercel.app/intermediate/competitor-intel) |
| 04 | **Literature Reviewer** | Searches recent papers, clusters findings, and produces a synthesized review. | [Run](https://outskill-mini-projects.vercel.app/intermediate/lit-reviewer) |
| 05 | **Job Application Assistant** | Tailors a resume to a JD and drafts a matching cover letter with citations. | [Run](https://outskill-mini-projects.vercel.app/intermediate/job-app-assistant) |
| 06 | **Dependency Vuln Scanner** | Scans a manifest for CVEs and proposes the safest upgrade path. | [Run](https://outskill-mini-projects.vercel.app/intermediate/dep-vuln-scanner) |
| 07 | **Launch Checklist** | Builds a launch-week checklist tailored to a product's stage and channels. | [Run](https://outskill-mini-projects.vercel.app/intermediate/launch-checklist) |
| 08 | **Podcast Show Notes** | Turns a transcript into structured show notes with chapters and quotables. | [Run](https://outskill-mini-projects.vercel.app/intermediate/podcast-show-notes) |
| 09 | **Real Estate Analyzer** | Pulls comps for an address and produces a price-band estimate with confidence. | [Run](https://outskill-mini-projects.vercel.app/intermediate/real-estate-analyzer) |
| 10 | **Incident Postmortem** | Synthesizes incident logs into a blameless postmortem with timeline and 5-whys. | [Run](https://outskill-mini-projects.vercel.app/intermediate/incident-postmortem) |

### Advanced — Production Pipelines

| # | Agent | What it does | Demo |
|---|---|---|---|
| 01 | **Hiring Pipeline** | Ingests a resume, builds a profile, matches it to live roles, drafts outreach. | [Run](https://outskill-mini-projects.vercel.app/advanced/hiring-pipeline) |
| 02 | **News Fact-Checker** | Decomposes a claim into atomic assertions and rates each with citations. | [Run](https://outskill-mini-projects.vercel.app/advanced/news-factchecker) |
| 03 | **Price Intelligence** | Tracks a product's price across competitors and recommends a positioning move. | [Run](https://outskill-mini-projects.vercel.app/advanced/price-intel) |
| 04 | **Crypto Portfolio Advisor** | Scores concentration risk and recommends rebalancing moves with target weights. | [Run](https://outskill-mini-projects.vercel.app/advanced/crypto-advisor) |
| 05 | **Repo Health Auditor** | Audits a GitHub repo across velocity, CI reliability, and review hygiene. | [Run](https://outskill-mini-projects.vercel.app/advanced/repo-health) |
| 06 | **Travel Planner** | Builds a multi-day itinerary with weather-aware day plans. | [Run](https://outskill-mini-projects.vercel.app/advanced/travel-planner) |
| 07 | **Account Sales Intel** | Builds a sales-ready brief on a target account with buying triggers. | [Run](https://outskill-mini-projects.vercel.app/advanced/sales-intel) |
| 08 | **License Auditor** | Walks a dependency tree and produces a counsel-ready license remediation plan. | [Run](https://outskill-mini-projects.vercel.app/advanced/license-auditor) |
| 09 | **Content Repurposer** | One long-form post → tweet thread + LinkedIn essay + 60-second video script. | [Run](https://outskill-mini-projects.vercel.app/advanced/content-repurposer) |
| 10 | **Energy Optimizer** | Reads building usage + tariffs and prescribes load-shifting to lower the bill. | [Run](https://outskill-mini-projects.vercel.app/advanced/energy-optimizer) |

---

## Repository Layout

```
outskill-mini-projects/
├── projects/                 # Python CrewAI pipelines (the actual agents)
│   ├── beginner/             #   01..10  single-agent
│   ├── intermediate/         #   01..10  multi-agent crews
│   ├── advanced/             #   01..10  production pipelines (some w/ FastAPI)
│   └── pyproject.toml        # uv-managed workspace
│
├── web/                      # Next.js 15 + React 19 demo site
│   ├── app/                  #   App Router — home, /[tier], /[tier]/[slug]
│   ├── components/           #   AppShell, Terminal/*, ProjectCard, DemoPlayground
│   └── lib/projects/         #   Per-project fixtures + the runProject() adapter
│
└── design/stitch/            # Source mockups (Stitch "AGENT_ARCHIVE" design system)
```

---

## Tech Stack

**Backend (Python)**
- [`crewai`](https://docs.crewai.com/) — multi-agent orchestration
- [`pydantic`](https://docs.pydantic.dev/) — typed inputs / outputs
- `fastapi` + `uvicorn` — production projects expose an `api_server.py`
- `OpenRouter`, `EXA`, `Adzuna`, `Open-Meteo`, `CoinGecko` — live tool integrations

**Frontend (TypeScript)**
- [`next@15.5`](https://nextjs.org/) (App Router, RSC) on [`react@19`](https://react.dev/)
- [`tailwindcss@3.4`](https://tailwindcss.com/) with a custom Stitch-inspired token system (`night`, `terminal`, `volt`, `cyan`, `magenta`)
- `lucide-react` for icons
- Space Grotesk · Inter · Fira Code, loaded via `next/font`

---

## Run Locally

### The web demo

```bash
cd web
npm install
npm run dev                 # http://localhost:3000
```

The site runs entirely on hardcoded fixtures by default — no API keys needed.

### A Python project

```bash
cd projects
uv sync                     # installs the workspace
uv run python -m beginner.01_resume_screener.main
```

Each Python project reads its API keys from environment variables (e.g. `OPENROUTER_API_KEY`, `EXA_API_KEY`). Copy them into a root-level `.env` (already gitignored).

---

## Wiring a Real Backend

Every web demo defines a `ProjectDef` with an optional `endpoint`. The shared adapter in [`web/lib/projects/runner.ts`](web/lib/projects/runner.ts) decides at runtime:

```ts
if (process.env.NEXT_PUBLIC_USE_REAL_BACKEND === "true" && def.endpoint) {
  return fetch(def.endpoint, { method: "POST", body: JSON.stringify(input) });
}
return streamFromFixture(def);
```

So shipping a real agent is two steps:

1. Run the matching `api_server.py` from `projects/<tier>/<n>_<name>/`.
2. Set `endpoint` on the `ProjectDef` and flip the env flag.

Same UI, real outputs.

---

## Deployment

The web app is deployed to Vercel:

- **Production**: [outskill-mini-projects.vercel.app](https://outskill-mini-projects.vercel.app)
- **Project**: `ishan-duttas-projects-a63436c2/outskill-mini-projects`
- **Framework**: Next.js (auto-detected)
- **Region**: `iad1`

Re-deploy:

```bash
cd web
vercel --prod
```

---

<div align="center">

Built with care for the **Outskill GenAI Mastery Challenge**.

</div>

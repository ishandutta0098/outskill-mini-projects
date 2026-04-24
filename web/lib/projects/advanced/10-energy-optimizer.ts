import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "energy-optimizer",
  tier: "advanced",
  number: "10",
  title: "Energy Optimizer",
  codename: "ENERGY_OPTIMIZER",
  blurb:
    "Reads a building's hourly usage and tariff schedule and prescribes load-shifting moves to lower the monthly bill.",
  status: "experimental",
  tags: ["Py_3.12", "CrewAI", "Pandas", "Pydantic"],
  pipeline: ["Usage Reader", "Tariff Aligner", "Load Shifter"],
  inputSchema: [
    {
      key: "building_kind",
      label: "BUILDING_KIND",
      kind: "select",
      options: ["home", "small-office", "warehouse", "data-room"],
    },
    {
      key: "context",
      label: "USAGE_CONTEXT",
      kind: "textarea",
      rows: 5,
      placeholder: "Describe the load profile, equipment, occupancy hours, current bill...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      building_kind: "small-office",
      context:
        "30-person office, 2,400 sq ft, AC + 2 server racks. Current bill: $2,450/month. ToU tariff: peak 4-9pm at $0.41/kWh, off-peak $0.13/kWh. Occupancy 9-6, work-from-home Fridays.",
    },
    output: `# Energy optimization: small office

## Baseline
- Monthly bill: $2,450
- Peak window contribution: 47% of bill
- Top loads in peak window: AC, server racks, kitchen appliances

## Recommended moves
1. Pre-cool the office 1-3pm
   Drop setpoint to 70 F by 3pm, then let it drift to 75 F by 5pm. Cuts AC peak draw 28%.

2. Shift overnight server jobs to 11pm-3am
   Anything running 5-7pm (CI builds, backups) moves to 11pm. Saves ~$140/mo.

3. Friday rampdown
   With WFH-Friday occupancy at ~12%, set HVAC to setback (78 F cooling) and disable common-area lights. Saves ~$95/mo.

4. Remove server-room "always-on" peaks
   Two servers run training jobs continuously. Window them to off-peak only. Saves ~$210/mo.

5. Battery wedge (longer term)
   A 10 kWh battery sized for the AC peak window pays back in ~3.4 years at current tariff.

## Estimated monthly savings
- Pre-cool + setback: $410
- Server-job shift: $140
- Friday rampdown: $95
- Off-peak training only: $210
**Total: ~$855/mo (35% reduction)**

## Risks
- Pre-cool comfort dip if outside temp >95 F
- Server job latency increases if training-window pushed back
- Battery payback assumes ToU spread doesn't compress`,
    log: [
      { tag: "BOOT", text: "Initializing energy_optimizer.crew" },
      { tag: "INFO", text: "Building: small-office, ToU tariff" },
      { tag: "STREAM", text: "[1/3] Reading 30-day hourly usage" },
      { tag: "PROCESS", text: "[1/3] Peak share: 47% of bill" },
      { tag: "STREAM", text: "[2/3] Aligning loads to tariff windows" },
      { tag: "STREAM", text: "[3/3] Composing load-shift plan" },
      { tag: "SUCCESS", text: "Plan generated - estimated savings $855/mo" },
    ],
  },
  endpoint: "/api/advanced/energy-optimizer",
};

import type { ProjectDef } from "../schema";

export const project: ProjectDef = {
  slug: "travel-planner",
  tier: "advanced",
  number: "06",
  title: "Travel Planner",
  codename: "TRAVEL_PLANNER",
  blurb:
    "Builds a multi-day itinerary from a destination, dates, and travel style, with weather-aware day plans.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenMeteo", "Requests"],
  pipeline: ["Destination Profiler", "Day Planner", "Weather Adjuster"],
  inputSchema: [
    {
      key: "destination",
      label: "DESTINATION",
      kind: "text",
      placeholder: "City, Country",
    },
    {
      key: "dates",
      label: "DATE_RANGE",
      kind: "text",
      placeholder: "e.g. 2026-06-12 to 2026-06-16",
    },
    {
      key: "style",
      label: "TRAVEL_STYLE",
      kind: "select",
      options: ["budget", "balanced", "premium"],
    },
  ],
  outputType: "markdown",
  fixture: {
    input: {
      destination: "Lisbon, Portugal",
      dates: "2026-06-12 to 2026-06-15",
      style: "balanced",
    },
    output: `# Lisbon - Jun 12 to Jun 15 (balanced)

## Weather snapshot
- Jun 12 (Fri): 27 C, sunny
- Jun 13 (Sat): 24 C, partly cloudy, brief rain late afternoon
- Jun 14 (Sun): 26 C, sunny
- Jun 15 (Mon): 28 C, sunny

## Day 1 - Fri Jun 12 (sunny)
- Late morning: walk Alfama loops, end at Miradouro de Santa Luzia
- Lunch: Cervejaria Ramiro (book a table; 30 min wait otherwise)
- Afternoon: tram 28 to Estrela; chill at Jardim da Estrela
- Evening: fado at Mesa de Frades

## Day 2 - Sat Jun 13 (rain late)
- Morning: Belem - Jeronimos + Pasteis de Belem (go before 11)
- Indoor pivot 4-6pm: MAAT exhibit (covers the rain window)
- Dinner: Time Out Market (covered)

## Day 3 - Sun Jun 14 (sunny)
- Day trip to Sintra - Pena Palace + Quinta da Regaleira (book Pena timed entry)
- Return to Lisbon by 7pm
- Late dinner: A Cevicheria (no reservations, plan for ~30 min wait)

## Day 4 - Mon Jun 15 (sunny)
- Morning: Principe Real shopping + Embaixada
- Lunch + lazy afternoon: Ribeira das Naus river walk
- Departure window after 6pm

## Bookings to lock now
- Cervejaria Ramiro - Fri lunch
- Mesa de Frades - Fri evening fado
- Pena Palace - Sun timed entry

## Style notes (balanced)
- Mid-tier hotel ~$160/night recommended (Memmo Alfama or Hotel da Baixa)
- Mix of sit-down dinners and casual lunches
- Sintra day trip done by train + walk, not private driver`,
    log: [
      { tag: "BOOT", text: "Initializing travel_planner.crew" },
      { tag: "INFO", text: "Lisbon, 4 days, balanced style" },
      { tag: "STREAM", text: "[1/3] Profiling destination - 47 candidate POIs" },
      { tag: "STREAM", text: "[2/3] Drafting per-day plans" },
      { tag: "STREAM", text: "[3/3] Pulling weather forecast (OpenMeteo)" },
      { tag: "PROCESS", text: "[3/3] Sat afternoon rain detected - pivoting to indoor option" },
      { tag: "SUCCESS", text: "Itinerary generated - 3 bookings flagged" },
    ],
  },
  endpoint: "/api/advanced/travel-planner",
};

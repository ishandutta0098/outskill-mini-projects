import os

from crewai import Task

from agents import (attractions_agent, destination_researcher,
                    itinerary_builder, weather_planner)

os.makedirs("task_outputs", exist_ok=True)

destination_brief_task = Task(
    description=(
        "Resolve the destination '{city}' using the geocoder, then build a short brief.\n"
        "Steps:\n"
        "1. Run geocode_city to get lat, lon, country, timezone.\n"
        "2. Run get_wikipedia_summary on '{city}' for context.\n"
        "3. Output a 5-line brief covering vibe, language, currency hint, best season, signature experience.\n"
        "4. End with a line: `coords: <lat>, <lon>` so downstream tasks can use it."
    ),
    expected_output=(
        "## Destination brief: <city>, <country>\n- ...\n- ...\ncoords: <lat>, <lon>"
    ),
    agent=destination_researcher,
    output_file="task_outputs/destination_brief.md",
)

weather_task = Task(
    description=(
        "Pull a {trip_days}-day forecast for the destination using its coords (from the brief). "
        "Translate the daily forecast into activity guidance per day (e.g., good for outdoors, "
        "museum day, indoor cafe day)."
    ),
    expected_output=(
        "## Weather plan\n| day | high_C | low_C | precip_mm | activity_guidance |\n|---|---|---|---|---|"
    ),
    agent=weather_planner,
    context=[destination_brief_task],
    output_file="task_outputs/weather_plan.md",
)

attractions_task = Task(
    description=(
        "Research the top attractions, food experiences, and current events for '{city}'.\n"
        "Steps:\n"
        "1. Use EXA to search for 'best things to do in {city} this month'.\n"
        "2. Use Wikipedia for any landmark you list, to confirm it exists.\n"
        "3. Output 8-12 items grouped by category (Sights, Food, Events, Day trips).\n"
        "4. Tag each item Indoor or Outdoor."
    ),
    expected_output=(
        "## Attractions\n### Sights\n- <name> (Outdoor) - <one liner> - source: <url>\n### Food\n- ..."
    ),
    agent=attractions_agent,
    output_file="task_outputs/attractions.md",
)

itinerary_task = Task(
    description=(
        "Build a {trip_days}-day itinerary for '{city}'. Pair Outdoor activities with good-weather "
        "days from the weather plan; keep Indoor activities for rainy days. End with a packing "
        "list driven by the forecast (rain gear if precip_mm > 5 on any day, layers if temp_min < 10C)."
    ),
    expected_output=(
        "# Trip Plan: <city> ({trip_days} days)\n\n## Day 1\n- Morning: ...\n- Afternoon: ...\n- Evening: ...\n"
        "...\n## Packing list\n- ..."
    ),
    agent=itinerary_builder,
    context=[destination_brief_task, weather_task, attractions_task],
    output_file="task_outputs/itinerary.md",
)

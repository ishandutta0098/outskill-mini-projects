import os

from crewai import Task

from agents import (optimization_advisor, tariff_research_agent, usage_parser,
                    weather_context_agent)

os.makedirs("task_outputs", exist_ok=True)

parse_usage_task = Task(
    description=(
        "Read the usage JSON at '{usage_path}' and parse it.\n"
        "Steps:\n"
        "1. Output household, city, country, latitude, longitude, tariff_inr_per_kwh, monthly_kwh_avg.\n"
        "2. For each appliance compute daily_kwh = rated_watts * daily_hours / 1000.\n"
        "3. Compute total_daily_kwh and total_monthly_kwh from the appliance list.\n"
        "4. Identify the top 3 appliances by daily_kwh."
    ),
    expected_output=(
        "## Usage breakdown\n- Household: ...\n- Coords: <lat>, <lon>\n- Tariff: <inr/kWh>\n"
        "## Appliance kWh\n| appliance | daily_kwh | monthly_kwh |\n|---|---|---|\n## Top 3 loads\n- ..."
    ),
    agent=usage_parser,
    output_file="task_outputs/usage_breakdown.md",
)

weather_context_task = Task(
    description=(
        "Pull a 7-day temperature forecast for the household's coordinates (from the parsed usage).\n"
        "Steps:\n"
        "1. Call get_temperature_forecast with the household lat/lon.\n"
        "2. Estimate per-day expected AC runtime change vs baseline (assume baseline = 28C; +1 hour AC per +2C above 28C of apparent_max).\n"
        "3. Output a table day-by-day."
    ),
    expected_output=(
        "## Weather impact on HVAC\n| day | temp_max | apparent_max | extra_AC_hours |\n|---|---|---|---|"
    ),
    agent=weather_context_agent,
    context=[parse_usage_task],
    output_file="task_outputs/weather_impact.md",
)

tariff_research_task = Task(
    description=(
        "Search the web for the household's region (country/city from usage JSON):\n"
        "1. Current residential electricity tariff slabs.\n"
        "2. Whether time-of-use / off-peak rates exist.\n"
        "3. Top 5 high-ROI residential energy efficiency tips for that region in the last 12 months."
    ),
    expected_output=(
        "## Regional tariff & efficiency context\n### Tariff slabs\n- ...\n### Time-of-use\n- ...\n### Top efficiency tips\n- ..."
    ),
    agent=tariff_research_agent,
    context=[parse_usage_task],
    output_file="task_outputs/tariff_context.md",
)

optimization_task = Task(
    description=(
        "Build the household's optimization plan.\n"
        "Steps:\n"
        "1. Estimate next-week kWh given baseline usage + weather impact.\n"
        "2. Recommend 5-7 actions, each with: appliance, change, estimated kWh saved per month, "
        "estimated INR saved per month using the household tariff.\n"
        "3. Sort actions by INR saved.\n"
        "4. Add a 'do this week' shortlist of 2 actions."
    ),
    expected_output=(
        "# Energy Optimization Plan\n\n## Next-week forecast\n- Expected kWh: <n>\n## Recommended actions\n| action | appliance | kWh/mo saved | INR/mo saved |\n|---|---|---|---|\n## Do this week\n1. ..."
    ),
    agent=optimization_advisor,
    context=[parse_usage_task, weather_context_task, tariff_research_task],
    output_file="task_outputs/optimization_plan.md",
)

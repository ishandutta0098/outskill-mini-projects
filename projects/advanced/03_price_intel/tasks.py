import os

from crewai import Task

from agents import (alert_generator, competitor_intel_agent, price_analyst,
                    product_scraper)

os.makedirs("task_outputs", exist_ok=True)

scrape_catalog_task = Task(
    description=(
        "Scrape the catalog for category '{category}' (up to 20 items). Return title, price, "
        "stock status, rating, and detail URL for each. Do not editorialize."
    ),
    expected_output=(
        "## Catalog snapshot ({category})\n- <title> - <price> - <stock> - <rating> - <url>"
    ),
    agent=product_scraper,
    output_file="task_outputs/catalog_snapshot.md",
)

competitor_search_task = Task(
    description=(
        "Search the web for comparable products and current competitor prices for '{category}'.\n"
        "Steps:\n"
        "1. For each scraped item, find at least one competitor listing if a comparable is available.\n"
        "2. Capture the competitor name, comparable product, and price.\n"
        "3. Note any active promos or shipping perks."
    ),
    expected_output=(
        "## Competitor signals\n- <our title> -> <competitor> @ <comp price> (promo: <yes/no>) - <url>"
    ),
    agent=competitor_intel_agent,
    output_file="task_outputs/competitor_signals.md",
)

price_analysis_task = Task(
    description=(
        "Compare our catalog prices to competitor signals and produce a price analysis.\n"
        "Steps:\n"
        "1. For each item, classify as: Underpriced (margin left on table), Priced In Line, or Overpriced.\n"
        "2. Estimate margin opportunity and risk in $ where reasonable.\n"
        "3. Flag stockouts or near-stockouts.\n"
        "4. Sort the output by impact (biggest margin opportunity first)."
    ),
    expected_output=(
        "## Underpriced items\n- <title> - current <price> - suggested <price> - opportunity: <impact>\n"
        "## In-line items\n- ...\n## Overpriced items\n- ...\n## Stockouts\n- ..."
    ),
    agent=price_analyst,
    context=[scrape_catalog_task, competitor_search_task],
    output_file="task_outputs/price_analysis.md",
)

alert_digest_task = Task(
    description=(
        "Produce a prioritized pricing alert digest for the head of merchandising.\n"
        "Steps:\n"
        "1. Top 5 'Act today' alerts with SKU, current price, recommended new price, rationale.\n"
        "2. 'Watchlist' section: 5-10 items to monitor in the next week.\n"
        "3. 'Stockout follow-ups' section.\n"
        "4. Close with a one-line summary of total margin opportunity captured."
    ),
    expected_output=(
        "# Pricing alert digest\n\n## Act today\n1. <SKU> - <old> -> <new> - <reason>\n\n"
        "## Watchlist\n- ...\n## Stockout follow-ups\n- ...\n## Net margin opportunity\n<line>"
    ),
    agent=alert_generator,
    context=[scrape_catalog_task, competitor_search_task, price_analysis_task],
    output_file="task_outputs/pricing_alerts.md",
)

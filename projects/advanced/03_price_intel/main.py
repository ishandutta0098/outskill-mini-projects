from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (alert_generator, competitor_intel_agent, price_analyst,
                    product_scraper)
from tasks import (alert_digest_task, competitor_search_task,
                   price_analysis_task, scrape_catalog_task)

scrape_crew = Crew(
    agents=[product_scraper],
    tasks=[scrape_catalog_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

competitor_crew = Crew(
    agents=[competitor_intel_agent],
    tasks=[competitor_search_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

analysis_crew = Crew(
    agents=[price_analyst, alert_generator],
    tasks=[price_analysis_task, alert_digest_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_price_intel(category: str) -> dict:
    inputs = {"category": category}
    with ThreadPoolExecutor(max_workers=2) as executor:
        scrape_future = executor.submit(scrape_crew.kickoff, inputs=inputs)
        competitor_future = executor.submit(competitor_crew.kickoff, inputs=inputs)
        scrape_out = str(scrape_future.result())
        competitor_out = str(competitor_future.result())
    digest = analysis_crew.kickoff(inputs=inputs)
    return {"catalog": scrape_out, "competitors": competitor_out, "alerts": str(digest)}


if __name__ == "__main__":
    print("Starting E-commerce Price Intelligence...")
    result = run_price_intel(category="bestselling fiction books")
    print("\nDone. See task_outputs/pricing_alerts.md for the final digest.")

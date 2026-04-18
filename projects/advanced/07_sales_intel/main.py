from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (homepage_scraper, lead_reader, lead_scorer,
                    news_researcher, outreach_drafter)
from tasks import (news_task, outreach_task, read_lead_task, score_task,
                   scrape_site_task)

intake_crew = Crew(
    agents=[lead_reader],
    tasks=[read_lead_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

site_crew = Crew(
    agents=[homepage_scraper],
    tasks=[scrape_site_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

news_crew = Crew(
    agents=[news_researcher],
    tasks=[news_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

scoring_crew = Crew(
    agents=[lead_scorer, outreach_drafter],
    tasks=[score_task, outreach_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_sales_intel(lead_path: str) -> dict:
    inputs = {"lead_path": lead_path}
    lead_out = str(intake_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=2) as executor:
        site_future = executor.submit(site_crew.kickoff, inputs=inputs)
        news_future = executor.submit(news_crew.kickoff, inputs=inputs)
        site_out = str(site_future.result())
        news_out = str(news_future.result())
    sequence = scoring_crew.kickoff(inputs=inputs)
    return {
        "lead": lead_out,
        "site": site_out,
        "news": news_out,
        "sequence": str(sequence),
    }


if __name__ == "__main__":
    print("Starting Sales Intel pipeline...")
    result = run_sales_intel(lead_path="inputs/lead.json")
    print("\nDone. See task_outputs/outreach_sequence.md for the final sequence.")

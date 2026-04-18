from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (claim_extractor, digest_composer, fact_checker,
                    headline_collector)
from tasks import (collect_bbc_task, collect_hn_task, collect_reuters_task,
                   compose_digest_task, extract_claims_task,
                   verify_claims_task)


def make_collect_crew(task) -> Crew:
    return Crew(
        agents=[headline_collector],
        tasks=[task],
        verbose=True,
        process=Process.sequential,
        cache=True,
        max_rpm=20,
    )


reuters_crew = make_collect_crew(collect_reuters_task)
bbc_crew = make_collect_crew(collect_bbc_task)
hn_crew = make_collect_crew(collect_hn_task)

verify_and_digest_crew = Crew(
    agents=[claim_extractor, fact_checker, digest_composer],
    tasks=[extract_claims_task, verify_claims_task, compose_digest_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_news_pipeline(topic: str) -> dict:
    inputs = {"topic": topic}
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            "reuters": executor.submit(reuters_crew.kickoff, inputs=inputs),
            "bbc": executor.submit(bbc_crew.kickoff, inputs=inputs),
            "hn": executor.submit(hn_crew.kickoff, inputs=inputs),
        }
        feeds = {name: str(f.result()) for name, f in futures.items()}
    digest = verify_and_digest_crew.kickoff(inputs=inputs)
    return {"feeds": feeds, "digest": str(digest)}


if __name__ == "__main__":
    print("Starting Multi-Source News Aggregator + Fact Checker...")
    result = run_news_pipeline(topic="AI regulation and frontier model policy")
    print("\nDone. See task_outputs/daily_digest.md for the final digest.")

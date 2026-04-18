from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (community_signal_agent, health_report_writer,
                    issue_triage_agent, repo_metadata_agent)
from tasks import (community_research_task, fetch_metadata_task,
                   triage_issues_task, write_report_task)

metadata_crew = Crew(
    agents=[repo_metadata_agent],
    tasks=[fetch_metadata_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

community_crew = Crew(
    agents=[community_signal_agent],
    tasks=[community_research_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

analysis_crew = Crew(
    agents=[issue_triage_agent, health_report_writer],
    tasks=[triage_issues_task, write_report_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_repo_health(owner_repo: str) -> dict:
    inputs = {"owner_repo": owner_repo}
    with ThreadPoolExecutor(max_workers=2) as executor:
        meta_future = executor.submit(metadata_crew.kickoff, inputs=inputs)
        community_future = executor.submit(community_crew.kickoff, inputs=inputs)
        metadata_out = str(meta_future.result())
        community_out = str(community_future.result())
    report = analysis_crew.kickoff(inputs=inputs)
    return {
        "metadata": metadata_out,
        "community": community_out,
        "report": str(report),
    }


if __name__ == "__main__":
    print("Starting Repo Health Auditor...")
    result = run_repo_health(owner_repo="crewAIInc/crewAI")
    print("\nDone. See task_outputs/health_report.md for the final report.")

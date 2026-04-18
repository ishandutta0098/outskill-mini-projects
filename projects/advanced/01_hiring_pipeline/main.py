from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (interview_scheduler, job_market_researcher, resume_parser,
                    screening_analyst)
from tasks import (draft_outreach_task, parse_resume_task,
                   screen_candidates_task, search_jobs_task)

intake_crew = Crew(
    agents=[resume_parser, job_market_researcher],
    tasks=[parse_resume_task, search_jobs_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

evaluation_crew = Crew(
    agents=[screening_analyst, interview_scheduler],
    tasks=[screen_candidates_task, draft_outreach_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_hiring_pipeline(resume_file_path: str) -> dict:
    inputs = {"resume_file_path": resume_file_path}
    intake_result = intake_crew.kickoff(inputs=inputs)
    evaluation_result = evaluation_crew.kickoff(inputs=inputs)
    return {
        "candidate_profile": str(intake_result),
        "screening_and_outreach": str(evaluation_result),
    }


if __name__ == "__main__":
    print("Starting AI-Powered Hiring Pipeline...")
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(run_hiring_pipeline, "inputs/resume.txt")
        result = future.result()
    print("\nDone. See task_outputs/outreach_emails.md for the final outreach.")

from crewai import Crew, Process

from agents import company_researcher, cover_letter_writer, jd_extractor
from tasks import (extract_jd_task, research_company_task,
                   write_cover_letter_task)

job_app_crew = Crew(
    agents=[jd_extractor, company_researcher, cover_letter_writer],
    tasks=[extract_jd_task, research_company_task, write_cover_letter_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Job Application Assistant...")
    candidate_summary = (
        "8 years building developer tools. Created an open-source TypeScript build "
        "tool used by 12k weekly downloads. Shipped Rust-backed bundler internals at "
        "previous startup. Active conference speaker on JS toolchains."
    )
    result = job_app_crew.kickoff(
        inputs={
            "jd_file_path": "inputs/job_description.txt",
            "company": "Vercel",
            "candidate_name": "Aarav Krishnan",
            "candidate_summary": candidate_summary,
        }
    )
    print("\nDone. See task_outputs/cover_letter.md for the final letter.")

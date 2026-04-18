import os

from crewai import Task

from agents import (interview_scheduler, job_market_researcher, resume_parser,
                    screening_analyst)

os.makedirs("task_outputs", exist_ok=True)

parse_resume_task = Task(
    description=(
        "Read the resume at {resume_file_path} and produce a structured candidate profile.\n"
        "Steps:\n"
        "1. Capture name, location, contact, total years of experience, and current title.\n"
        "2. Extract top 8-10 skills.\n"
        "3. Determine target role and seniority (junior/mid/senior/lead/staff).\n"
        "4. Note any standout signals (OSS, talks, scale, mentorship)."
    ),
    expected_output=(
        "## Candidate\n- Name, location, years, current title\n## Skills\n- ...\n## Target role + seniority\n<...>\n"
        "## Standout signals\n- ..."
    ),
    agent=resume_parser,
    output_file="task_outputs/candidate_profile.md",
)

search_jobs_task = Task(
    description=(
        "Search live job openings that match the candidate profile.\n"
        "Steps:\n"
        "1. Build a 4-8 word search query from the target role + key skills.\n"
        "2. Call the jobs search tool (default country='in', tweak to 'us' or 'gb' if the candidate is located there).\n"
        "3. Return up to 10 best matches with title, company, location, salary range (if any), and listing URL.\n"
        "4. Filter out obvious mismatches (junior listings for a senior, etc.)."
    ),
    expected_output=(
        "## Top job matches\n1. <title> @ <company> - <location> - <salary or n/a> - <url>\n"
        "(up to 10 entries)"
    ),
    agent=job_market_researcher,
    context=[parse_resume_task],
    output_file="task_outputs/job_matches.md",
)

screen_candidates_task = Task(
    description=(
        "Score the fit of the candidate against each job and write screening questions for the top 3.\n"
        "Steps:\n"
        "1. For every job, give a fit score 1-10 with a one-line justification.\n"
        "2. Pick the top 3 jobs by fit score.\n"
        "3. For each top-3 job, write 5 screening questions tailored to the role.\n"
        "4. Recommend the next step for each top-3 job (Pursue, Hold, Pass)."
    ),
    expected_output=(
        "## Fit scores\n- <job> - <score>/10 - <reason>\n## Top 3 picks\n### <job>\nNext step: ...\nScreening questions:\n1. ...\n2. ..."
    ),
    agent=screening_analyst,
    context=[parse_resume_task, search_jobs_task],
    output_file="task_outputs/screening_brief.md",
)

draft_outreach_task = Task(
    description=(
        "Draft personalized outreach emails for each of the top 3 jobs.\n"
        "Steps:\n"
        "1. Each email under 180 words, references both a job specific and a candidate strength.\n"
        "2. Propose 3 phone-screen time slots over the next 7 business days (in IST). \n"
        "3. End with a clear scheduling CTA."
    ),
    expected_output=(
        "## Outreach emails\n### Job 1: <title> @ <company>\nSubject: <...>\n\n<email body>\n\nProposed slots: ...\n\n... (3 emails total)"
    ),
    agent=interview_scheduler,
    context=[parse_resume_task, search_jobs_task, screen_candidates_task],
    output_file="task_outputs/outreach_emails.md",
)

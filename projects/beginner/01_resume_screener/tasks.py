from crewai import Task

from agents import resume_screener

screen_resume_task = Task(
    description=(
        "Evaluate the resume against the job description and produce a fit verdict.\n"
        "Follow these steps:\n"
        "1. Read the job description carefully and list the must-have skills, nice-to-haves, and seniority level.\n"
        "2. Read the resume and extract the candidate's relevant skills, years of experience, and notable impact.\n"
        "3. Compare the two and judge how strongly the resume satisfies the must-haves.\n"
        "4. Choose exactly one verdict: 'Strong Fit', 'Moderate Fit', or 'Weak Fit'.\n"
        "5. Justify the verdict in 2-3 short bullets that point to specific evidence from the resume.\n\n"
        "Job Description:\n{job_description}\n\n"
        "Resume:\n{resume}"
    ),
    expected_output=(
        "Verdict: <Strong Fit | Moderate Fit | Weak Fit>\n"
        "Justification:\n- <bullet 1>\n- <bullet 2>\n- <bullet 3 optional>"
    ),
    agent=resume_screener,
)

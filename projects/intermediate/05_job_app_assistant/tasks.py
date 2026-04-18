import os

from crewai import Task

from agents import company_researcher, cover_letter_writer, jd_extractor

os.makedirs("task_outputs", exist_ok=True)

extract_jd_task = Task(
    description=(
        "Read the job description at {jd_file_path} and extract:\n"
        "1. Role title, level, location / remote policy.\n"
        "2. Must-have requirements.\n"
        "3. Nice-to-have requirements.\n"
        "4. Culture / values signals from the JD wording.\n"
        "5. The single most important capability the JD is hiring for."
    ),
    expected_output=(
        "## Role\n<title, level, location>\n## Must-haves\n- ...\n## Nice-to-haves\n- ...\n"
        "## Culture signals\n- ...\n## Hiring focus\n<one line>"
    ),
    agent=jd_extractor,
    output_file="task_outputs/jd_summary.md",
)

research_company_task = Task(
    description=(
        "Research {company} and gather signals a candidate should reference in their application.\n"
        "Steps:\n"
        "1. Find recent product launches, funding, leadership changes (last 6 months).\n"
        "2. Find any public statements about culture, values, or working style.\n"
        "3. Identify 2-3 specific moves the candidate could naturally reference."
    ),
    expected_output=(
        "## Recent moves\n- ...\n## Culture / values\n- ...\n## Reference-worthy items\n- <item> - <why it fits>"
    ),
    agent=company_researcher,
    context=[extract_jd_task],
    output_file="task_outputs/company_research.md",
)

write_cover_letter_task = Task(
    description=(
        "Write a tailored cover letter from candidate '{candidate_name}' for the role at {company}.\n"
        "Steps:\n"
        "1. Open by referencing one specific recent move from the company research.\n"
        "2. In the second paragraph, map 2-3 of the candidate's strengths (from {candidate_summary}) "
        "to the JD's must-haves, with concrete proof points.\n"
        "3. Close with a confident, specific reason for wanting this role.\n"
        "4. Keep it under 350 words. No cliches like 'I am writing to apply'."
    ),
    expected_output=(
        "Dear <Hiring Team or specific name if known>,\n\n<3-4 paragraph cover letter>\n\nSincerely,\n<candidate name>"
    ),
    agent=cover_letter_writer,
    context=[extract_jd_task, research_company_task],
    output_file="task_outputs/cover_letter.md",
)

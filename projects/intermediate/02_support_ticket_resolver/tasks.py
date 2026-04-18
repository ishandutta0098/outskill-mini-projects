import os

from crewai import Task

from agents import response_drafter, solution_searcher, ticket_analyzer

os.makedirs("task_outputs", exist_ok=True)

analyze_ticket_task = Task(
    description=(
        "Read the customer support ticket at {ticket_file_path} and extract a structured summary.\n"
        "Steps:\n"
        "1. Read the entire ticket file.\n"
        "2. Identify the core symptom in one sentence.\n"
        "3. Pull out the affected product area, environment (browsers, OS, plan), and priority.\n"
        "4. List what the customer has already tried.\n"
        "5. Note any deadlines or business impact mentioned."
    ),
    expected_output=(
        "## Core issue\n<one sentence>\n## Product area\n<area>\n## Environment\n<browsers/OS/plan>\n"
        "## Already tried\n- <step>\n## Impact / deadline\n<line>"
    ),
    agent=ticket_analyzer,
    output_file="task_outputs/ticket_analysis.md",
)

search_solutions_task = Task(
    description=(
        "Based on the ticket analysis, search documentation, release notes, and community forums "
        "for fixes or workarounds.\n"
        "Steps:\n"
        "1. Search for the symptom + the product area to find any official docs or known issues.\n"
        "2. Search recent release notes near the date the issue began for related changes.\n"
        "3. Find at least one official source and one community discussion if possible.\n"
        "4. Summarize the most likely fix and one viable workaround."
    ),
    expected_output=(
        "## Likely root cause\n<one paragraph>\n## Official sources\n- <link or title>\n"
        "## Community sources\n- <link or title>\n## Recommended fix\n<steps>\n## Workaround\n<steps>"
    ),
    agent=solution_searcher,
    context=[analyze_ticket_task],
    output_file="task_outputs/solution_search.md",
)

draft_response_task = Task(
    description=(
        "Draft a customer-facing response that the support agent can send with minimal edits.\n"
        "Steps:\n"
        "1. Open by acknowledging the impact (the customer's compliance report deadline, etc.).\n"
        "2. Confirm what we found (root cause, whether known) without speculating.\n"
        "3. Provide the recommended fix or workaround in clear numbered steps.\n"
        "4. Set expectations on a follow-up timeline.\n"
        "5. Sign off warmly. Stay under 250 words."
    ),
    expected_output=(
        "Subject: <reply subject>\n\nHi <customer first name>,\n\n<reply body in 3-5 short paragraphs>\n\nThanks,\n<agent name placeholder>"
    ),
    agent=response_drafter,
    context=[analyze_ticket_task, search_solutions_task],
    output_file="task_outputs/customer_reply.md",
)

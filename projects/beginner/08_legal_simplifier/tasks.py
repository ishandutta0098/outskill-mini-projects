from crewai import Task

from agents import legal_clause_simplifier

simplify_clause_task = Task(
    description=(
        "Rewrite the following legal clause in clear, simple language a non-lawyer can understand, "
        "and flag any potentially risky terms.\n"
        "Steps:\n"
        "1. Read the clause carefully and identify the parties, the obligation, the trigger, and the consequence.\n"
        "2. Rewrite it in plain English in 2-4 short sentences. Preserve the legal meaning exactly.\n"
        "3. Flag any terms that disproportionately favor one party (auto-renewal, broad indemnity, "
        "unlimited liability, IP assignment, exclusivity, non-compete, etc.).\n"
        "4. Add a short disclaimer that this is informational, not legal advice.\n\n"
        "Clause:\n{clause}"
    ),
    expected_output=(
        "## Plain English\n<rewritten clause>\n\n"
        "## Risky terms\n- <term>: <why it is risky>\n\n"
        "## Disclaimer\n<one line>"
    ),
    agent=legal_clause_simplifier,
)

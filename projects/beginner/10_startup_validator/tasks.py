from crewai import Task

from agents import startup_idea_validator

validate_idea_task = Task(
    description=(
        "Give a structured reality check on the startup idea below.\n"
        "Steps:\n"
        "1. Estimate the target market: who exactly is the buyer, how many of them exist, and roughly how much they would pay.\n"
        "2. Name 3-5 plausible competitors or substitute behaviors and one-line positioning of each.\n"
        "3. List the top 3 key risks (market, technical, distribution, regulatory, etc.).\n"
        "4. Give a feasibility score from 1 to 10 with a one-line justification.\n"
        "5. End with one of three verdicts: 'Pursue', 'Pivot', or 'Pass'.\n\n"
        "Idea:\n{idea}"
    ),
    expected_output=(
        "## Target market\n<who, how many, willingness to pay>\n\n"
        "## Competitive landscape\n- <competitor>: <positioning>\n\n"
        "## Key risks\n1. <risk>\n2. <risk>\n3. <risk>\n\n"
        "## Feasibility score\n<1-10> - <justification>\n\n"
        "## Verdict\n<Pursue | Pivot | Pass> - <one line>"
    ),
    agent=startup_idea_validator,
)

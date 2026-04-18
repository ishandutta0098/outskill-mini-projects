from crewai import Crew

from agents import startup_idea_validator
from tasks import validate_idea_task

crew = Crew(
    agents=[startup_idea_validator],
    tasks=[validate_idea_task],
    verbose=False,
)

idea = (
    "A subscription service for solo founders that pairs them with a fractional ops "
    "manager (10 hours / week) plus an AI agent that handles invoicing, vendor follow-ups, "
    "and inbox triage. $999/month, designed for pre-seed founders earning under $20k MRR."
)

result = crew.kickoff(inputs={"idea": idea})

print("Response:", result)

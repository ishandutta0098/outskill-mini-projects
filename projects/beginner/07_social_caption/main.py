from crewai import Crew

from agents import social_caption_writer
from tasks import write_caption_task

crew = Crew(
    agents=[social_caption_writer],
    tasks=[write_caption_task],
    verbose=False,
)

description = (
    "Launch announcement: a $39 minimalist mechanical keyboard for writers, "
    "with hot-swappable switches, an aluminum frame, and a 3-year warranty. "
    "Ships globally from August 1st."
)

platform = "LinkedIn"

result = crew.kickoff(inputs={"description": description, "platform": platform})

print("Response:", result)

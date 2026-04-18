from crewai import Crew

from agents import email_tone_rewriter
from tasks import rewrite_email_task

crew = Crew(
    agents=[email_tone_rewriter],
    tasks=[rewrite_email_task],
    verbose=False,
)

email = (
    "Hey, the design files you sent yesterday are basically unusable for engineering. "
    "Half the components have no specs and the spacing is all over the place. "
    "We need a fixed version by Friday or the sprint slips. Sort it out."
)

tone = "formal"

result = crew.kickoff(inputs={"email": email, "tone": tone})

print("Response:", result)

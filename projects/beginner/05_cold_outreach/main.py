from crewai import Crew

from agents import cold_outreach_writer
from tasks import write_outreach_task

crew = Crew(
    agents=[cold_outreach_writer],
    tasks=[write_outreach_task],
    verbose=False,
)

company = "Razorpay"
product = (
    "An AI agent platform that automatically resolves Tier-1 customer support tickets "
    "by reading the ticket, finding the right answer in your docs, and drafting a reply "
    "for an agent to approve in one click."
)

result = crew.kickoff(inputs={"company": company, "product": product})

print("Response:", result)

from crewai import Crew

from agents import resume_screener
from tasks import screen_resume_task

crew = Crew(
    agents=[resume_screener],
    tasks=[screen_resume_task],
    verbose=False,
)

job_description = (
    "Senior Backend Engineer (Python). "
    "Must-haves: 5+ years Python, FastAPI/Django, PostgreSQL, AWS, distributed systems. "
    "Nice-to-haves: Kafka, Kubernetes, observability tooling. Remote, US time zones."
)

resume = (
    "Priya Sharma. 6 years backend engineering at fintech startups. "
    "Built FastAPI microservices serving 4M req/day on AWS (ECS, RDS Postgres, SQS). "
    "Led migration from monolith to event-driven architecture using Kafka. "
    "Comfortable with Kubernetes, Terraform, and Datadog dashboards. Based in Bengaluru, open to US-overlap hours."
)

result = crew.kickoff(inputs={"job_description": job_description, "resume": resume})

print("Response:", result)

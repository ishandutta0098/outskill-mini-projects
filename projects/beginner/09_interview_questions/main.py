from crewai import Crew

from agents import interview_question_designer
from tasks import generate_questions_task

crew = Crew(
    agents=[interview_question_designer],
    tasks=[generate_questions_task],
    verbose=False,
)

role = "Backend Engineer (Python / Distributed Systems)"
level = "senior"

result = crew.kickoff(inputs={"role": role, "level": level})

print("Response:", result)

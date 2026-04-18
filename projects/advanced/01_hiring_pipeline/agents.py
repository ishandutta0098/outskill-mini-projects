import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import resume_reader_tool, search_jobs

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

resume_parser = Agent(
    role="Resume Parser",
    goal="Read a resume file and extract candidate profile, skills, target role, and seniority signals",
    llm=llm,
    backstory=(
        "You are an executive recruiter who has parsed 50,000+ resumes across engineering and "
        "product. You produce a structured candidate profile that downstream agents can act on."
    ),
    tools=[resume_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

job_market_researcher = Agent(
    role="Job Market Researcher",
    goal="Find live job openings that match the candidate profile and capture salary, location, and company signals",
    llm=llm,
    backstory=(
        "You are a recruiter who knows how to query job boards and pull only the openings that "
        "are realistic matches given a candidate's seniority and skills."
    ),
    tools=[search_jobs],
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=600,
    max_rpm=15,
)

screening_analyst = Agent(
    role="Screening Analyst",
    goal="Score candidate-to-job fit, generate role-specific screening questions, and recommend the next step for each job",
    llm=llm,
    backstory=(
        "You are a hiring manager who has run hundreds of phone screens. You score candidates "
        "against jobs with a tight rubric and write screening questions that surface real signal."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

interview_scheduler = Agent(
    role="Interview Scheduler",
    goal="Draft a personalized outreach email and propose a phone-screen schedule for the top 3 jobs",
    llm=llm,
    backstory=(
        "You are a candidate experience lead who is famous for outreach that gets >70% reply rates. "
        "Your emails reference specifics from the job and the candidate's profile."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

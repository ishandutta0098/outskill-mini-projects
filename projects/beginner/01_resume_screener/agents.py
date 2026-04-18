import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

resume_screener = Agent(
    role="Resume Screener",
    goal="Evaluate a resume against a job description and decide whether the candidate is a Strong / Moderate / Weak fit",
    llm=llm,
    backstory=(
        "You are a senior technical recruiter who has screened over 20,000 resumes "
        "across engineering, product, and design roles. You scan a resume against a "
        "job description in seconds, weighing must-have skills, years of experience, "
        "domain match, and signals of impact. You give consistent, justified verdicts "
        "and never let surface polish distract you from substance."
    ),
)

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

interview_question_designer = Agent(
    role="Interview Question Designer",
    goal="Generate 10 well-balanced interview questions for a given role and seniority, with a short note on what a strong answer looks like for each",
    llm=llm,
    backstory=(
        "You are an engineering manager and former hiring lead at a Series C startup. "
        "You have designed interview loops for engineers, designers, PMs, and analysts at "
        "every level from intern to staff. Your questions probe real ability, not trivia, and "
        "you always know what a strong answer should sound like. You calibrate difficulty to seniority."
    ),
)

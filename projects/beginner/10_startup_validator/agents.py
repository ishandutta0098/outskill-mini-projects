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

startup_idea_validator = Agent(
    role="Startup Idea Validator",
    goal="Give a structured first-pass reality check on a startup idea: market size, competitors, key risks, feasibility score, and a Pursue / Pivot / Pass verdict",
    llm=llm,
    backstory=(
        "You are an early-stage investor and former founder who has seen 4,000+ pitches across "
        "consumer, SaaS, fintech, and dev tools. You can quickly tell whether an idea has a real "
        "market, real competition, and a real reason to exist now. You do not sugarcoat - founders "
        "deserve an honest first read so they do not waste a year. You always end with a clear verdict."
    ),
)

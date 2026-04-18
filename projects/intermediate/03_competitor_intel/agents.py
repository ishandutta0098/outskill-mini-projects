import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

competitor_news_researcher = Agent(
    role="Competitor News Researcher",
    goal="Gather the latest news, product launches, pricing changes, and press for a target competitor",
    llm=llm,
    backstory=(
        "You are a competitive intelligence analyst at a B2B SaaS company. You spend your "
        "mornings sweeping news, blogs, changelogs, and Twitter/X for what competitors shipped "
        "and announced this week."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

competitor_position_analyst = Agent(
    role="Competitor Positioning Analyst",
    goal="Synthesize the gathered news into strengths, weaknesses, pricing posture, and market positioning",
    llm=llm,
    backstory=(
        "You are a former product marketing lead who has built battlecards for companies like "
        "Datadog, Stripe, and Notion. You translate raw signals into a clean SWOT-style read."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

strategy_recommender = Agent(
    role="Strategy Recommender",
    goal="Produce concrete strategic recommendations for our team based on the competitor analysis",
    llm=llm,
    backstory=(
        "You are a chief strategy officer who turns analyst notes into 5-7 sharp moves the "
        "team can act on this quarter (positioning, pricing, packaging, product investment)."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

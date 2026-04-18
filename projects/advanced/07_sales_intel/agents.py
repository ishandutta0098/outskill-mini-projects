import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import (exa_search_tool, lead_reader_tool, scrape_company_homepage)

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

lead_reader = Agent(
    role="Lead Intake Specialist",
    goal="Read the lead JSON and produce a clean lead summary",
    llm=llm,
    backstory=(
        "You normalize CRM leads. You extract company name, website, target persona, and what we sell."
    ),
    tools=[lead_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=120,
    max_rpm=10,
)

homepage_scraper = Agent(
    role="Company Homepage Scraper",
    goal="Pull the company's positioning, value props, and product surface from their homepage",
    llm=llm,
    backstory=(
        "You read company homepages like a sales engineer: you grab the headline, sub-headline, "
        "and anything that hints at use cases or customer logos."
    ),
    tools=[scrape_company_homepage],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

news_researcher = Agent(
    role="Account News Researcher",
    goal="Find recent news, funding, hires, and product launches for the target account",
    llm=llm,
    backstory=(
        "You are a SDR researcher. You find buying triggers: layoffs, funding rounds, exec hires, "
        "new product launches, and earnings commentary."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

lead_scorer = Agent(
    role="Lead Scorer",
    goal="Score the lead 0-100 on fit and timing and explain the score",
    llm=llm,
    backstory=(
        "You run a scoring rubric every AE trusts: ICP fit, persona match, buying signals, and "
        "current pain. You always cite the evidence behind a score."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=300,
    max_rpm=10,
)

outreach_drafter = Agent(
    role="Outreach Copywriter",
    goal="Write a 4-step outreach sequence personalized to the account and persona",
    llm=llm,
    backstory=(
        "You write the outreach copy that books meetings: short, specific, and tied to a real "
        "trigger. No fluff, no 'I hope this finds you well'."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

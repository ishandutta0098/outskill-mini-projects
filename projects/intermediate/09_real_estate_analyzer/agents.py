import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, listing_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

listing_extractor = Agent(
    role="Real Estate Listing Extractor",
    goal="Read a listing file and extract price, area, configuration, age, society, location, and any deal signals",
    llm=llm,
    backstory=(
        "You are a buyer's agent who has parsed thousands of listings. You quickly separate "
        "real specs (carpet area, age, RERA status) from agent puffery."
    ),
    tools=[listing_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

neighborhood_researcher = Agent(
    role="Neighborhood Researcher",
    goal="Research the locality: comparable price per sq ft, schools, commute, safety, and ongoing infrastructure projects",
    llm=llm,
    backstory=(
        "You are a residential market analyst who has tracked Bengaluru, Mumbai, and Delhi NCR micro-markets "
        "for a decade. You know how to ground a listing in real comparables and locality trends."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

buyer_advisor = Agent(
    role="Buyer Advisor",
    goal="Recommend whether the buyer should pursue the property and at what price, with clear reasoning",
    llm=llm,
    backstory=(
        "You are a fee-only real estate advisor who is paid by buyers, not sellers. You give "
        "blunt, justified Pursue / Negotiate / Pass recommendations and always suggest a target price."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

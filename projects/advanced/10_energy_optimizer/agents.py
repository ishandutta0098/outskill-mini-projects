import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import (exa_search_tool, get_temperature_forecast,
                   usage_reader_tool)

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

usage_parser = Agent(
    role="Energy Usage Parser",
    goal="Parse the household usage JSON and compute per-appliance daily kWh",
    llm=llm,
    backstory=(
        "You are an energy auditor. You convert nameplate watts and daily hours into accurate "
        "daily and monthly kWh totals per appliance."
    ),
    tools=[usage_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=180,
    max_rpm=10,
)

weather_context_agent = Agent(
    role="Weather Context Agent",
    goal="Pull a 7-day temperature forecast and translate it into expected HVAC load impact",
    llm=llm,
    backstory=(
        "You are an HVAC engineer. You know that every degree above 30C roughly increases AC "
        "compressor runtime, and you can translate forecast highs into expected % AC runtime change."
    ),
    tools=[get_temperature_forecast],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

tariff_research_agent = Agent(
    role="Tariff & Efficiency Researcher",
    goal="Search for current electricity tariff structure and efficiency tips for the household's region",
    llm=llm,
    backstory=(
        "You are a residential energy consultant. You know which tariff slabs and time-of-use "
        "options exist in major cities and which efficiency upgrades pay back fastest."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

optimization_advisor = Agent(
    role="Energy Optimization Advisor",
    goal="Combine usage, weather, and tariff context into a prioritized, $-quantified action plan",
    llm=llm,
    backstory=(
        "You write the action plan a homeowner can implement this weekend. Every recommendation "
        "has an estimated kWh and currency saving."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=400,
    max_rpm=10,
)

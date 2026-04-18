import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import (exa_search_tool, geocode_city, get_weather_forecast,
                   get_wikipedia_summary)

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

destination_researcher = Agent(
    role="Destination Researcher",
    goal="Resolve the destination city and pull a concise factual brief about it",
    llm=llm,
    backstory=(
        "You are a travel writer for Lonely Planet. You know how to summarize a city in 5 lines: "
        "what it's known for, when to visit, and the must-do experience."
    ),
    tools=[geocode_city, get_wikipedia_summary],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

weather_planner = Agent(
    role="Weather Planner",
    goal="Pull a daily weather forecast for the trip dates and translate it into activity guidance",
    llm=llm,
    backstory=(
        "You are an outdoor expedition guide who plans around the weather. You know which "
        "weather codes mean rain, snow, or great sightseeing days."
    ),
    tools=[get_weather_forecast],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

attractions_agent = Agent(
    role="Attractions Researcher",
    goal="Find the highest-impact attractions, foods, and current events at the destination",
    llm=llm,
    backstory=(
        "You are a concierge who books experiences for travelers. You only recommend things that "
        "are open and currently well-rated."
    ),
    tools=[exa_search_tool, get_wikipedia_summary],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

itinerary_builder = Agent(
    role="Itinerary Builder",
    goal="Combine the destination brief, weather, and attractions into a day-by-day itinerary plus packing list",
    llm=llm,
    backstory=(
        "You build itineraries that travelers can follow without re-planning anything. You group "
        "activities by neighborhood and respect the weather forecast."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

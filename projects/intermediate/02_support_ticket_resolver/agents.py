import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, ticket_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

ticket_analyzer = Agent(
    role="Support Ticket Analyzer",
    goal="Read a customer support ticket file and extract the core issue, affected product area, environment, and urgency",
    llm=llm,
    backstory=(
        "You are a Tier-2 support engineer who has triaged tens of thousands of tickets. "
        "You can quickly separate the actual symptom from the customer's hypothesis and "
        "spot the version, environment, and reproduction details that engineering will need."
    ),
    tools=[ticket_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

solution_searcher = Agent(
    role="Solution Searcher",
    goal="Find existing fixes, documentation, and community solutions for the identified issue",
    llm=llm,
    backstory=(
        "You are a developer-experience engineer who lives in docs portals, GitHub issues, and Stack Overflow. "
        "You quickly find the right doc page, recent release note, or community workaround for any reported bug."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

response_drafter = Agent(
    role="Customer Response Drafter",
    goal="Draft a clear, empathetic customer-facing response that explains the fix or workaround and sets expectations on follow-up",
    llm=llm,
    backstory=(
        "You are a customer success manager known for writing replies that customers actually thank you for. "
        "You acknowledge the impact, give a concrete next step, and never blame the customer."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

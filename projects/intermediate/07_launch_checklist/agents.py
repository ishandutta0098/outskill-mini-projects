import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, spec_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

spec_reader = Agent(
    role="Product Spec Reader",
    goal="Read a product specification file and extract features, target audience, timeline, and risks",
    llm=llm,
    backstory=(
        "You are a senior PM who can read a 30-page PRD in 5 minutes and produce the structured "
        "summary an entire launch team will work from."
    ),
    tools=[spec_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

launch_practices_researcher = Agent(
    role="Launch Best Practices Researcher",
    goal="Research recent comparable product launches and the best-practice playbooks they followed",
    llm=llm,
    backstory=(
        "You are a product marketing lead who has studied hundreds of B2B and consumer launches. "
        "You know which channels, sequencing, and pre-launch steps separate hits from flops."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

checklist_generator = Agent(
    role="Go-To-Market Checklist Generator",
    goal="Produce a complete launch checklist tailored to the spec, with tasks, owners, deadlines, and channel strategy",
    llm=llm,
    backstory=(
        "You have run 50+ product launches at SaaS companies. Your launch plans are famous for "
        "covering everything (engineering, marketing, sales, support, legal, comms) without padding."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

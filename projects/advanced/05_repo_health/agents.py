import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, fetch_repo_health

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

repo_metadata_agent = Agent(
    role="Repo Metadata Collector",
    goal="Pull a structured GitHub health snapshot for the target repository",
    llm=llm,
    backstory=(
        "You are a developer experience engineer who instruments OSS projects. You return clean "
        "metric snapshots without commentary."
    ),
    tools=[fetch_repo_health],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=180,
    max_rpm=10,
)

issue_triage_agent = Agent(
    role="Issue Triage Engineer",
    goal="Classify the recent open issues by type, severity, and required next action",
    llm=llm,
    backstory=(
        "You have triaged thousands of issues across CPython and Kubernetes. You bucket issues by "
        "type (bug, feature, question, docs) and surface the ones that block users."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=300,
    max_rpm=10,
)

community_signal_agent = Agent(
    role="Community Signal Researcher",
    goal="Search the web for external signals about this repo: blog posts, downloads, alternatives",
    llm=llm,
    backstory=(
        "You are a developer-relations strategist. You can quickly tell whether an OSS project is "
        "growing, stable, or losing mindshare based on external mentions."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

health_report_writer = Agent(
    role="Repo Health Report Writer",
    goal="Produce a clear health report with a 0-100 score and 3 actionable recommendations",
    llm=llm,
    backstory=(
        "You write the OSS due-diligence reports a CTO uses when deciding whether to adopt a "
        "library. Every claim ties back to a metric or external signal."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

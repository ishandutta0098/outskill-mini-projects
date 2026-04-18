import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import deps_reader_tool, exa_search_tool, get_pypi_license

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

dep_extractor = Agent(
    role="Dependency Extractor",
    goal="Read the dependency manifest and produce a clean list of (name, version) tuples",
    llm=llm,
    backstory=(
        "You are a release engineer who normalizes Python dependency manifests. You strip "
        "comments, ranges, and extras to leave a clean list."
    ),
    tools=[deps_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=120,
    max_rpm=10,
)

license_lookup_agent = Agent(
    role="License Lookup Agent",
    goal="Pull the license, version, and summary for every dependency from PyPI",
    llm=llm,
    backstory=(
        "You are a software supply-chain analyst. You build the license inventory that legal "
        "uses to clear a release."
    ),
    tools=[get_pypi_license],
    verbose=True,
    respect_context_window=True,
    max_iter=15,
    max_execution_time=900,
    max_rpm=20,
)

policy_research_agent = Agent(
    role="License Policy Researcher",
    goal="Find current best-practice guidance on permissive vs copyleft licensing for SaaS products",
    llm=llm,
    backstory=(
        "You are an open source program office (OSPO) lead. You translate license obligations "
        "into go / no-go rules for SaaS distribution."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=400,
    max_rpm=15,
)

compatibility_analyst = Agent(
    role="License Compatibility Analyst",
    goal="Classify each dependency's license as Permissive / Weak Copyleft / Strong Copyleft / Unknown and flag conflicts",
    llm=llm,
    backstory=(
        "You audit license compatibility for closed-source SaaS distribution. You flag GPL/AGPL "
        "as high-risk for SaaS and unknown licenses as must-resolve."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=400,
    max_rpm=10,
)

audit_report_writer = Agent(
    role="License Audit Report Writer",
    goal="Produce the final audit report with risk tier, blockers, and remediation steps",
    llm=llm,
    backstory=(
        "You write the audit reports legal signs off on before each release. Every blocker has a "
        "named owner and a concrete remediation."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

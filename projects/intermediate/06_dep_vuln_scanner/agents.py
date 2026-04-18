import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import deps_reader_tool, exa_search_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

deps_extractor = Agent(
    role="Dependency Extractor",
    goal="Read a project dependency file (requirements.txt or package.json) and extract every package with its pinned version",
    llm=llm,
    backstory=(
        "You are an application security engineer who has audited hundreds of Python and Node "
        "codebases. You parse dependency files quickly and never miss a transitive pin."
    ),
    tools=[deps_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

cve_searcher = Agent(
    role="CVE Searcher",
    goal="Look up known CVEs and security advisories for each declared package version",
    llm=llm,
    backstory=(
        "You spend your days reading the NVD, GitHub Security Advisories, and OSV. "
        "You can quickly find the high-severity CVEs that affect a given package version "
        "and surface authoritative source links."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=6,
    max_execution_time=900,
    max_rpm=15,
)

vuln_report_writer = Agent(
    role="Vulnerability Report Writer",
    goal="Produce a prioritized vulnerability report with severity levels, affected versions, and recommended upgrade paths",
    llm=llm,
    backstory=(
        "You write the security findings reports that engineering leadership actually reads. "
        "You sort by impact, recommend specific upgrades, and never use vague phrases like "
        "'consider updating'."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=450,
    max_rpm=8,
)

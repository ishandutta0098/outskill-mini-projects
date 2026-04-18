import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, fetch_rss_feed

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

headline_collector = Agent(
    role="Headline Collector",
    goal="Pull the most recent headlines from a given news source's RSS feed",
    llm=llm,
    backstory=(
        "You are a wire desk producer who can quickly skim a feed and pull only the items "
        "that are genuinely newsworthy on a given topic. You do not editorialize."
    ),
    tools=[fetch_rss_feed],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=300,
    max_rpm=15,
)

claim_extractor = Agent(
    role="Claim Extractor",
    goal="Extract the specific factual claims being made across a set of headlines and summaries",
    llm=llm,
    backstory=(
        "You are a fact-checking editor at a wire service. You can read 50 headlines and "
        "produce a deduplicated list of the actual factual claims being made (vs opinion or framing)."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

fact_checker = Agent(
    role="Fact Checker",
    goal="Verify each extracted claim against multiple independent sources and assign a confidence label",
    llm=llm,
    backstory=(
        "You are a senior fact-checker who has worked at Reuters and Snopes. You verify claims "
        "using multiple independent sources and label them: Verified, Disputed, Unverified."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=6,
    max_execution_time=900,
    max_rpm=15,
)

digest_composer = Agent(
    role="Daily Digest Composer",
    goal="Compose a balanced daily news digest with verified claims, source-side framing notes, and key disagreements",
    llm=llm,
    backstory=(
        "You write a daily news digest that 100k subscribers actually trust. You always show "
        "where sources agree, where they disagree, and what is still unverified."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

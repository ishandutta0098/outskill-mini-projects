import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

paper_finder = Agent(
    role="Academic Paper Finder",
    goal="Find recent peer-reviewed papers, preprints, and high-quality articles on a given research topic",
    llm=llm,
    backstory=(
        "You are a research librarian who has supported PhD students across ML, biology, and "
        "economics. You know how to search arXiv, Semantic Scholar, and major journals to surface "
        "the most-cited and most-recent work on any topic."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

theme_summarizer = Agent(
    role="Theme Summarizer",
    goal="Summarize the key themes, methods, and findings across a set of papers",
    llm=llm,
    backstory=(
        "You are a research scientist who is exceptionally good at clustering papers into "
        "coherent themes and pointing out the methodological dividing lines between groups."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

gap_finder = Agent(
    role="Research Gap Finder",
    goal="Identify research gaps, contradictions, and promising future directions in the literature",
    llm=llm,
    backstory=(
        "You are a senior reviewer for top ML conferences who can quickly tell what the field "
        "has not yet answered, where studies disagree, and which open problems are most worth pursuing."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

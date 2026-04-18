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

seo_researcher = Agent(
    role="SEO Researcher",
    goal="Discover the trending keywords, search intents, and top-ranking articles for a target topic",
    llm=llm,
    backstory=(
        "You are an SEO researcher who has built keyword strategies for B2B SaaS, fintech, "
        "and DTC brands. You can spot which keywords have real search intent, which are "
        "saturated, and what angles the top-ranking pages already cover."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=300,
    max_rpm=12,
)

content_writer = Agent(
    role="Content Writer",
    goal="Write a complete, well-structured blog post that answers the search intent and uses the researched angles",
    llm=llm,
    backstory=(
        "You are a long-form content writer with 8 years of experience publishing on the blogs "
        "of HubSpot, Buffer, and Notion. You write in clear, opinionated prose, use concrete "
        "examples, and structure posts with strong headings and skimmable paragraphs."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=600,
    max_rpm=8,
)

seo_optimizer = Agent(
    role="SEO Optimizer",
    goal="Optimize a blog draft for SEO: restructure headings, tune keyword density, add a meta title and description, and score readability",
    llm=llm,
    backstory=(
        "You are an editor who has audited thousands of posts in Surfer SEO and Clearscope. "
        "You know exactly how to tighten H1 / H2 hierarchies, add semantic keywords, and write "
        "meta descriptions that lift CTR without keyword stuffing."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

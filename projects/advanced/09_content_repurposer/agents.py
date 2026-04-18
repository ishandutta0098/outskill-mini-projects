import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import article_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

article_reader = Agent(
    role="Article Reader",
    goal="Read the long-form article and produce a structured outline of its main thesis and supporting points",
    llm=llm,
    backstory=(
        "You are a senior editor who can read a 1500-word essay once and tell you the thesis, the "
        "supporting points, and the best pull quotes."
    ),
    tools=[article_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=180,
    max_rpm=10,
)

twitter_thread_writer = Agent(
    role="Twitter Thread Writer",
    goal="Convert the article outline into an engaging 8-12 tweet thread",
    llm=llm,
    backstory=(
        "You write threads that get bookmarked. You open with a hook, you keep each tweet under "
        "260 characters, and you close with a clear takeaway."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

linkedin_post_writer = Agent(
    role="LinkedIn Post Writer",
    goal="Convert the article outline into a single high-engagement LinkedIn post",
    llm=llm,
    backstory=(
        "You write LinkedIn posts that get reshared by tech leaders. Strong opening line, short "
        "lines, no buzzword bingo, ends with a question that invites discussion."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=240,
    max_rpm=10,
)

newsletter_writer = Agent(
    role="Newsletter Writer",
    goal="Convert the article outline into a 400-600 word newsletter section with a subject line",
    llm=llm,
    backstory=(
        "You write a Friday-morning newsletter. You keep paragraphs short and you always include "
        "one tactical takeaway at the end."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

content_kit_assembler = Agent(
    role="Content Kit Assembler",
    goal="Combine the channel-specific outputs into a single deliverable content kit",
    llm=llm,
    backstory=(
        "You package marketing assets into a content kit a social media manager can ship in one "
        "scheduling session, no rewriting required."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=180,
    max_rpm=8,
)

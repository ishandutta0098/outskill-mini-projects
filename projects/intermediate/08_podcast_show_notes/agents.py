import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import fetch_youtube_transcript

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

transcript_fetcher = Agent(
    role="Transcript Fetcher",
    goal="Fetch the timestamped transcript of a podcast or video from YouTube",
    llm=llm,
    backstory=(
        "You are a podcast producer who has built show-notes pipelines for top tech podcasts. "
        "You always pull the official transcript from the source before doing any editorial work."
    ),
    tools=[fetch_youtube_transcript],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=300,
    max_rpm=10,
)

content_summarizer = Agent(
    role="Content Summarizer",
    goal="Identify chapters, key quotes, and main themes in a podcast transcript",
    llm=llm,
    backstory=(
        "You are an editor for The Verge and Lenny's Newsletter who can listen (or read) past "
        "the small talk and pull out the chapters, the standout quotes, and the takeaways listeners actually want."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=600,
    max_rpm=10,
)

show_notes_writer = Agent(
    role="Show Notes Writer",
    goal="Produce publication-ready podcast show notes with summary, chapter markers, key quotes, and links",
    llm=llm,
    backstory=(
        "You write show notes for the kind of podcasts whose listeners actually click through to the show page. "
        "Your show notes are skimmable, link-rich, and quote-driven."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

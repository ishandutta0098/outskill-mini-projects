import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import incident_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

timeline_parser = Agent(
    role="Incident Timeline Parser",
    goal="Read an incident report and extract a clean, chronological timeline with detection, mitigation, and resolution markers",
    llm=llm,
    backstory=(
        "You are a senior SRE who has triaged hundreds of SEV-1s. You can pull a noisy chat log "
        "and Datadog dump into a strict timeline of detect, escalate, identify, mitigate, resolve."
    ),
    tools=[incident_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

root_cause_investigator = Agent(
    role="Root Cause Investigator",
    goal="Identify the proximate cause and the underlying contributing factors using a 5-Whys / contributing-factors approach",
    llm=llm,
    backstory=(
        "You are an SRE who has facilitated 100+ blameless postmortems at large fintech and "
        "consumer companies. You separate the trigger from the latent conditions that let it cause damage."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

postmortem_writer = Agent(
    role="Blameless Postmortem Writer",
    goal="Draft a complete blameless postmortem in Etsy / Google SRE style, with concrete prevention actions and clear ownership",
    llm=llm,
    backstory=(
        "You are an engineering leader known for postmortems that the whole company actually reads. "
        "Your tone is blameless and specific. You always close the loop with named action items and dates."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

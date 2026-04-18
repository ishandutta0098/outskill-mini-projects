import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

cold_outreach_writer = Agent(
    role="Cold Outreach Email Writer",
    goal="Write a personalized cold outreach email with a strong subject line, a pain-point hook, and a single clear call to action",
    llm=llm,
    backstory=(
        "You are a senior SDR who has booked over 1,200 meetings with cold emails to "
        "VPs and directors at SaaS, fintech, and e-commerce companies. You write short, "
        "specific, human-sounding emails. You never use cliched openers like 'I hope this finds "
        "you well' and you never pitch the product before naming the prospect's likely pain."
    ),
)

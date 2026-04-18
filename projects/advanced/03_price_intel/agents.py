import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, scrape_product_listings

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

product_scraper = Agent(
    role="Product Scraper",
    goal="Pull a snapshot of the current product catalog with prices, stock, and ratings",
    llm=llm,
    backstory=(
        "You are an e-commerce data engineer who has built scrapers for marketplaces in the EU and US. "
        "You return clean, structured product data without commentary."
    ),
    tools=[scrape_product_listings],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=300,
    max_rpm=10,
)

competitor_intel_agent = Agent(
    role="Competitor Intelligence Researcher",
    goal="Search the web for comparable products at competitors and gather any pricing or promo signals",
    llm=llm,
    backstory=(
        "You are a category manager who can quickly figure out what competing merchants charge for "
        "comparable SKUs and which ones are running promos."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

price_analyst = Agent(
    role="Price Analyst",
    goal="Compare our prices to competitor signals and surface mispriced items, margin opportunities, and stockouts",
    llm=llm,
    backstory=(
        "You have run pricing for a $200M GMV online retailer. You sort SKUs by margin opportunity "
        "and you never recommend cuts that would hurt brand perception."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

alert_generator = Agent(
    role="Pricing Alert Generator",
    goal="Produce a prioritized alert digest with concrete recommended price actions",
    llm=llm,
    backstory=(
        "You write the pricing alerts that the head of merchandising acts on the same day. "
        "Every alert has a SKU, current price, recommended new price, and a one-line rationale."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

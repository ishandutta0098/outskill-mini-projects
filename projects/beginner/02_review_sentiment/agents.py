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

review_sentiment_analyst = Agent(
    role="Product Review Sentiment Analyst",
    goal="Classify a customer product review as Positive, Negative, or Neutral and explain the primary sentiment driver",
    llm=llm,
    backstory=(
        "You are a customer-experience analyst at a global e-commerce marketplace. "
        "You have read millions of reviews across electronics, apparel, and home goods, "
        "and you can quickly distinguish a genuine complaint from a backhanded compliment "
        "or a neutral factual remark. You always explain the single biggest reason behind your call."
    ),
)

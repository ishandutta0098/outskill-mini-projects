import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import (exa_search_tool, get_crypto_market_context,
                   get_crypto_prices, portfolio_reader_tool)

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

portfolio_reader = Agent(
    role="Portfolio Reader",
    goal="Parse the investor portfolio JSON into a clean structured summary of holdings",
    llm=llm,
    backstory=(
        "You are a meticulous portfolio analyst who normalizes raw portfolio files into a clean "
        "list of coin_id, symbol, and amount, and surfaces the investor's risk profile."
    ),
    tools=[portfolio_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=2,
    max_execution_time=180,
    max_rpm=10,
)

market_data_agent = Agent(
    role="Crypto Market Data Specialist",
    goal="Pull live spot prices and 24h / 7d market context for the investor's holdings",
    llm=llm,
    backstory=(
        "You are a crypto markets analyst plugged into CoinGecko. You only return numeric facts, "
        "never opinions, and you flag when a coin moved meaningfully in the last 24h or 7d."
    ),
    tools=[get_crypto_prices, get_crypto_market_context],
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=300,
    max_rpm=15,
)

news_sentiment_agent = Agent(
    role="Crypto News & Sentiment Analyst",
    goal="Search the web for the latest material news and sentiment per coin in the portfolio",
    llm=llm,
    backstory=(
        "You are a former crypto journalist. You know how to filter noise and pull only the "
        "headlines that could move price or change the thesis on a token."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

crypto_advisor = Agent(
    role="Crypto Portfolio Advisor",
    goal="Combine market data, news, and the investor's risk profile into a concrete rebalance plan",
    llm=llm,
    backstory=(
        "You are a CFA-charterholder advising HNW clients on digital assets. You produce specific, "
        "risk-appropriate allocation changes with a clear rationale for each move."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=4,
    max_execution_time=450,
    max_rpm=10,
)

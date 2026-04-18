from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (crypto_advisor, market_data_agent, news_sentiment_agent,
                    portfolio_reader)
from tasks import (advisory_task, market_data_task, news_research_task,
                   read_portfolio_task)

intake_crew = Crew(
    agents=[portfolio_reader],
    tasks=[read_portfolio_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

market_crew = Crew(
    agents=[market_data_agent],
    tasks=[market_data_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

news_crew = Crew(
    agents=[news_sentiment_agent],
    tasks=[news_research_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

advisor_crew = Crew(
    agents=[crypto_advisor],
    tasks=[advisory_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=15,
)


def run_crypto_advisor(portfolio_path: str) -> dict:
    inputs = {"portfolio_path": portfolio_path}
    portfolio_out = str(intake_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=2) as executor:
        market_future = executor.submit(market_crew.kickoff, inputs=inputs)
        news_future = executor.submit(news_crew.kickoff, inputs=inputs)
        market_out = str(market_future.result())
        news_out = str(news_future.result())
    recommendation = advisor_crew.kickoff(inputs=inputs)
    return {
        "portfolio": portfolio_out,
        "market": market_out,
        "news": news_out,
        "recommendation": str(recommendation),
    }


if __name__ == "__main__":
    print("Starting Crypto Portfolio Advisor...")
    result = run_crypto_advisor(portfolio_path="inputs/portfolio.json")
    print("\nDone. See task_outputs/portfolio_recommendation.md for the final plan.")

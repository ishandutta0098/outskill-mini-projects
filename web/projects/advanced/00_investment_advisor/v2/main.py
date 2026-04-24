import asyncio
import time

from crewai import Crew, Process, Task

from agents import analyst, data_explorer, fin_expert, news_info_explorer
from tasks import InvestmentRecommendation, validate_recommendation


def build_single_stock_crew():
    """Build a crew for analyzing a single stock."""
    financials_task = Task(
        description="Get financial data like income statements and other fundamental ratios for stock: {stock}. "
        "Use the year 2026 as the current year.",
        expected_output="Detailed information from income statement, key ratios for {stock}.",
        agent=data_explorer,
    )

    news_task = Task(
        description="Get latest news and business information about company: {stock}. "
        "Use the year 2026 as the current year.",
        expected_output="Latest news and business information about the company.",
        agent=news_info_explorer,
    )

    analysis_task = Task(
        description="Make thorough analysis based on given financial data and latest news of a stock.",
        expected_output="Comprehensive analysis of a stock outlining financial health, stock valuation, risks, and news.",
        agent=analyst,
        context=[financials_task, news_task],
    )

    advise_task = Task(
        description="Make a recommendation about investing in a stock, based on analysis provided and current stock price.",
        expected_output="A structured investment recommendation with action, confidence, target price, reasons, and risks.",
        agent=fin_expert,
        context=[analysis_task],
        output_pydantic=InvestmentRecommendation,
        guardrail=validate_recommendation,
    )

    crew = Crew(
        agents=[data_explorer, news_info_explorer, analyst, fin_expert],
        tasks=[financials_task, news_task, analysis_task, advise_task],
        process=Process.sequential,
        verbose=True,
        cache=True,
        max_rpm=15,
    )
    return crew


async def analyze_watchlist(stocks: list[str]):
    """Analyze multiple stocks in parallel using async."""
    crews_and_stocks = []
    for stock in stocks:
        crew = build_single_stock_crew()
        crews_and_stocks.append((crew, stock))

    tasks = [
        crew.kickoff_async(inputs={"stock": stock})
        for crew, stock in crews_and_stocks
    ]
    results = await asyncio.gather(*tasks)
    return dict(zip(stocks, results))


if __name__ == "__main__":
    watchlist = ["AAPL", "GOOGL", "MSFT"]
    print(f"Analyzing watchlist: {watchlist}")

    start_time = time.time()
    results = asyncio.run(analyze_watchlist(watchlist))
    elapsed = time.time() - start_time

    print(f"\nCompleted in {elapsed:.2f}s ({elapsed/60:.1f} min)")
    for stock, result in results.items():
        rec = result.pydantic
        print(f"{stock}: {rec.action} (confidence: {rec.confidence})")

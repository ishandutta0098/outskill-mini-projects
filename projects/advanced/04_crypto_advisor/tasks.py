import os

from crewai import Task

from agents import (crypto_advisor, market_data_agent, news_sentiment_agent,
                    portfolio_reader)

os.makedirs("task_outputs", exist_ok=True)

read_portfolio_task = Task(
    description=(
        "Read the portfolio JSON at '{portfolio_path}' and produce a normalized summary.\n"
        "Steps:\n"
        "1. Use the file reader tool to load the JSON.\n"
        "2. Extract owner, base_currency, risk_profile, and a list of holdings.\n"
        "3. For each holding, output coin_id, symbol, and amount.\n"
        "4. End with a comma-separated string of coin_ids labeled `coin_ids_csv:`."
    ),
    expected_output=(
        "## Portfolio summary\nOwner: <name>\nBase currency: <ccy>\nRisk profile: <profile>\n"
        "Holdings:\n- <symbol> (<coin_id>): <amount>\ncoin_ids_csv: <ids>"
    ),
    agent=portfolio_reader,
    output_file="task_outputs/portfolio_summary.md",
)

market_data_task = Task(
    description=(
        "Using `coin_ids_csv` from the portfolio summary and `base_currency`, fetch:\n"
        "1. Current spot prices via the prices tool.\n"
        "2. 24h and 7d % change and market cap via the market context tool.\n"
        "3. Flag any coin with |24h change| >= 5% or |7d change| >= 15% as MOVER."
    ),
    expected_output=(
        "## Market snapshot\n| coin | price | 24h % | 7d % | market_cap | flag |\n"
        "|---|---|---|---|---|---|\n| <symbol> | <price> | <pct> | <pct> | <mcap> | <MOVER/-> |"
    ),
    agent=market_data_agent,
    context=[read_portfolio_task],
    output_file="task_outputs/market_snapshot.md",
)

news_research_task = Task(
    description=(
        "For each coin in the portfolio, search the web for the most relevant news from the last "
        "30 days that could affect price or thesis.\n"
        "Steps:\n"
        "1. Run a focused query per coin (e.g. 'bitcoin ETF news', 'ethereum upgrade').\n"
        "2. Capture headline, source, date, and a one-line summary.\n"
        "3. Tag each item as Bullish / Bearish / Neutral."
    ),
    expected_output=(
        "## News & sentiment\n### <SYMBOL>\n- [Bullish] <headline> - <source> (<date>) - <summary>"
    ),
    agent=news_sentiment_agent,
    context=[read_portfolio_task],
    output_file="task_outputs/news_sentiment.md",
)

advisory_task = Task(
    description=(
        "Combine the portfolio summary, market snapshot, and news sentiment into a rebalance plan "
        "tailored to the investor's risk profile.\n"
        "Steps:\n"
        "1. Compute current USD value per holding and total portfolio value.\n"
        "2. Recommend target allocation % per coin given risk profile and signals.\n"
        "3. For each coin output: action (Buy / Sell / Hold), $ amount, and 1-line rationale.\n"
        "4. Add a short 'risks to watch' section."
    ),
    expected_output=(
        "# Crypto Portfolio Recommendation\n\n## Current allocation\n- <SYM>: $<value> (<pct>%)\n\n"
        "## Target allocation\n- <SYM>: <pct>%\n\n## Action plan\n- <SYM>: <Buy/Sell/Hold> $<amount> - <rationale>\n\n"
        "## Risks to watch\n- ..."
    ),
    agent=crypto_advisor,
    context=[read_portfolio_task, market_data_task, news_research_task],
    output_file="task_outputs/portfolio_recommendation.md",
)

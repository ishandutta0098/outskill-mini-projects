import os

from crewai import Task

from agents import (competitor_news_researcher, competitor_position_analyst,
                    strategy_recommender)

os.makedirs("task_outputs", exist_ok=True)

gather_news_task = Task(
    description=(
        "Gather the latest competitive intelligence on {competitor}.\n"
        "Steps:\n"
        "1. Search for press releases, product launches, and major announcements in the last 90 days.\n"
        "2. Search for pricing changes, packaging shifts, or new tiers.\n"
        "3. Search for funding, leadership moves, or partnerships.\n"
        "4. Search for customer reviews and notable complaints.\n"
        "5. Always include source URLs."
    ),
    expected_output=(
        "## Recent launches\n- <date>: <launch> (<source>)\n\n"
        "## Pricing / packaging changes\n- ...\n\n"
        "## Funding / leadership / partnerships\n- ...\n\n"
        "## Customer signals\n- <quote or complaint> (<source>)"
    ),
    agent=competitor_news_researcher,
    output_file="task_outputs/competitor_news.md",
)

analyze_position_task = Task(
    description=(
        "Synthesize the gathered news on {competitor} into a positioning brief.\n"
        "Steps:\n"
        "1. Identify 3 current strengths.\n"
        "2. Identify 3 current weaknesses or gaps.\n"
        "3. Describe their pricing posture (premium, value, freemium, enterprise-only, etc.).\n"
        "4. Summarize where they are aiming next based on the signals.\n"
        "5. Cite the specific items from the news section that support each claim."
    ),
    expected_output=(
        "## Strengths\n- ...\n## Weaknesses\n- ...\n## Pricing posture\n<paragraph>\n## Where they are aiming\n<paragraph>"
    ),
    agent=competitor_position_analyst,
    context=[gather_news_task],
    output_file="task_outputs/competitor_positioning.md",
)

recommend_strategy_task = Task(
    description=(
        "Produce 5-7 concrete recommendations for our team this quarter, given what {competitor} is doing.\n"
        "Each recommendation must include: a specific action, the owning function (product/marketing/sales/cs), "
        "and the expected outcome. End with a one-line 'biggest threat' and 'biggest opportunity'."
    ),
    expected_output=(
        "## Recommendations\n1. <action> - Owner: <fn> - Expected outcome: <...>\n... (5-7 total)\n\n"
        "## Biggest threat\n<line>\n## Biggest opportunity\n<line>"
    ),
    agent=strategy_recommender,
    context=[gather_news_task, analyze_position_task],
    output_file="task_outputs/strategy_recommendations.md",
)

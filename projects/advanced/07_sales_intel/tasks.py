import os

from crewai import Task

from agents import (homepage_scraper, lead_reader, lead_scorer,
                    news_researcher, outreach_drafter)

os.makedirs("task_outputs", exist_ok=True)

read_lead_task = Task(
    description=(
        "Read the lead JSON at '{lead_path}' and produce a clean lead summary.\n"
        "Output: company, website, industry, target_persona, our_product."
    ),
    expected_output=(
        "## Lead\n- Company: ...\n- Website: ...\n- Industry: ...\n- Target persona: ...\n- Our product: ..."
    ),
    agent=lead_reader,
    output_file="task_outputs/lead_summary.md",
)

scrape_site_task = Task(
    description=(
        "Scrape the company's homepage (use the website from the lead summary).\n"
        "Steps:\n"
        "1. Call scrape_company_homepage with the website URL.\n"
        "2. Summarize the company's positioning in 3 bullets.\n"
        "3. Identify their primary product surface and 2-3 likely use cases."
    ),
    expected_output=(
        "## Company positioning\n- ...\n- ...\n## Product surface\n- ...\n## Likely use cases\n- ..."
    ),
    agent=homepage_scraper,
    context=[read_lead_task],
    output_file="task_outputs/company_positioning.md",
)

news_task = Task(
    description=(
        "Search the web for recent material news about the company (last 6 months).\n"
        "Steps:\n"
        "1. Look for funding, exec hires, product launches, layoffs, partnerships.\n"
        "2. Tag each item as a Buying Trigger or Context.\n"
        "3. Capture source and date."
    ),
    expected_output=(
        "## Account news\n### Buying triggers\n- <date> - <headline> - <source>\n### Context\n- ..."
    ),
    agent=news_researcher,
    context=[read_lead_task],
    output_file="task_outputs/account_news.md",
)

score_task = Task(
    description=(
        "Score the lead 0-100 across: ICP Fit (0-30), Persona Match (0-20), Buying Signals (0-30), Pain Hypothesis (0-20).\n"
        "Show each sub-score with a one-line evidence citation. End with the total and a Tier (A/B/C)."
    ),
    expected_output=(
        "## Lead score\n- ICP Fit: <n>/30 - <evidence>\n- Persona Match: <n>/20 - ...\n- Buying Signals: <n>/30 - ...\n- Pain Hypothesis: <n>/20 - ...\n\nTotal: <n>/100 (Tier: <A/B/C>)"
    ),
    agent=lead_scorer,
    context=[read_lead_task, scrape_site_task, news_task],
    output_file="task_outputs/lead_score.md",
)

outreach_task = Task(
    description=(
        "Write a 4-step outbound sequence (Email 1, Email 2, LinkedIn DM, Email 3) targeting the persona.\n"
        "Each step must reference at least one specific signal from the news or positioning research. "
        "Keep each email under 90 words. Include subject lines. End with a one-sentence CTA per step."
    ),
    expected_output=(
        "# Outreach sequence\n## Email 1\nSubject: ...\nBody: ...\nCTA: ...\n## Email 2\n...\n## LinkedIn DM\n...\n## Email 3\n..."
    ),
    agent=outreach_drafter,
    context=[read_lead_task, scrape_site_task, news_task, score_task],
    output_file="task_outputs/outreach_sequence.md",
)

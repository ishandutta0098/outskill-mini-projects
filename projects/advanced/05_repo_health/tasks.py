import os

from crewai import Task

from agents import (community_signal_agent, health_report_writer,
                    issue_triage_agent, repo_metadata_agent)

os.makedirs("task_outputs", exist_ok=True)

fetch_metadata_task = Task(
    description=(
        "Fetch a GitHub health snapshot for repo '{owner_repo}' using the metadata tool. "
        "Return the raw JSON, then a short bullet summary covering stars, forks, open issues, "
        "license, primary language, and last commit date."
    ),
    expected_output=(
        "## Raw\n```json\n<json>\n```\n## Summary\n- Stars: ...\n- Forks: ...\n- Open issues: ...\n"
        "- License: ...\n- Language: ...\n- Last commit: ..."
    ),
    agent=repo_metadata_agent,
    output_file="task_outputs/repo_metadata.md",
)

triage_issues_task = Task(
    description=(
        "Using the metadata snapshot, triage the recent_issues list.\n"
        "Steps:\n"
        "1. Bucket each issue as Bug, Feature, Question, or Docs.\n"
        "2. Score severity (P0 / P1 / P2) based on title, comment count, and labels.\n"
        "3. Recommend a next action per issue (close, label, prioritize, ask for repro)."
    ),
    expected_output=(
        "## Triage table\n| # | title | type | severity | next_action |\n|---|---|---|---|---|"
    ),
    agent=issue_triage_agent,
    context=[fetch_metadata_task],
    output_file="task_outputs/issue_triage.md",
)

community_research_task = Task(
    description=(
        "Search the web for external community signals on the repo '{owner_repo}'.\n"
        "Steps:\n"
        "1. Find recent blog posts, talks, or tutorials mentioning the project (last 6 months).\n"
        "2. Find at least 2 alternative / competing projects.\n"
        "3. Capture sentiment (positive / mixed / negative) per source."
    ),
    expected_output=(
        "## External mentions\n- <title> - <source> (<date>) - sentiment: <...>\n## Alternatives\n- <name> - <why people consider it>"
    ),
    agent=community_signal_agent,
    output_file="task_outputs/community_signals.md",
)

write_report_task = Task(
    description=(
        "Write the final repo health report combining metadata, triage, and community signals.\n"
        "Steps:\n"
        "1. Compute a 0-100 health score with a one-line breakdown of how you weighted velocity, "
        "issue load, license, and community traction.\n"
        "2. Strengths section (3-5 bullets).\n"
        "3. Risks section (3-5 bullets).\n"
        "4. Top 3 recommended actions for a maintainer."
    ),
    expected_output=(
        "# Repo Health Report: <owner/repo>\n\n## Health score: <score>/100\n## Strengths\n- ...\n"
        "## Risks\n- ...\n## Recommended actions\n1. ..."
    ),
    agent=health_report_writer,
    context=[fetch_metadata_task, triage_issues_task, community_research_task],
    output_file="task_outputs/health_report.md",
)

import os

from crewai import Task

from agents import (claim_extractor, digest_composer, fact_checker,
                    headline_collector)

os.makedirs("task_outputs", exist_ok=True)


def make_collect_task(source_label: str, feed_url: str, output_filename: str) -> Task:
    return Task(
        description=(
            f"Pull the 10 most recent items from the {source_label} feed at {feed_url}. "
            "Filter to items relevant to the topic '{topic}' if any are clearly off-topic; "
            "otherwise return them all."
        ),
        expected_output=(
            f"## {source_label} headlines\n- <title> - <published> - <link>\n- <summary one-liner>"
        ),
        agent=headline_collector,
        output_file=f"task_outputs/{output_filename}",
    )


collect_reuters_task = make_collect_task(
    "Reuters",
    "https://feeds.reuters.com/reuters/topNews",
    "headlines_reuters.md",
)
collect_bbc_task = make_collect_task(
    "BBC",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "headlines_bbc.md",
)
collect_hn_task = make_collect_task(
    "Hacker News",
    "https://hnrss.org/frontpage",
    "headlines_hn.md",
)

extract_claims_task = Task(
    description=(
        "From the collected headlines (Reuters, BBC, Hacker News), extract a deduplicated list of "
        "the specific factual claims being made about '{topic}'.\n"
        "Steps:\n"
        "1. Skip pure opinion / framing.\n"
        "2. Merge near-duplicate claims across sources.\n"
        "3. For each claim, list the sources that made it."
    ),
    expected_output=(
        "## Claims\n1. <claim> - Sources: [Reuters, BBC]\n2. <claim> - Sources: [HN]"
    ),
    agent=claim_extractor,
    context=[collect_reuters_task, collect_bbc_task, collect_hn_task],
    output_file="task_outputs/claims.md",
)

verify_claims_task = Task(
    description=(
        "Fact-check each claim against multiple independent sources.\n"
        "Steps:\n"
        "1. For each claim, search at least 2 reputable independent sources.\n"
        "2. Label as Verified, Disputed, or Unverified.\n"
        "3. Add a one-line note explaining the label and cite the source URLs."
    ),
    expected_output=(
        "## Verified claims\n- <claim> - <source urls>\n## Disputed claims\n- <claim> - <why> - <urls>\n## Unverified\n- <claim>"
    ),
    agent=fact_checker,
    context=[extract_claims_task],
    output_file="task_outputs/verified_claims.md",
)

compose_digest_task = Task(
    description=(
        "Compose the daily news digest on '{topic}'.\n"
        "Steps:\n"
        "1. Open with the 3 most important verified developments.\n"
        "2. Add a 'Where sources disagree' section.\n"
        "3. Add a 'Still unverified' section.\n"
        "4. Add a short 'Source framing' note for Reuters / BBC / HN coverage tone.\n"
        "5. Stay under 700 words."
    ),
    expected_output=(
        "# Daily digest: {topic}\n\n## Top developments\n1. ...\n## Where sources disagree\n- ...\n"
        "## Still unverified\n- ...\n## Source framing\n- Reuters: ...\n- BBC: ...\n- HN: ..."
    ),
    agent=digest_composer,
    context=[verify_claims_task],
    output_file="task_outputs/daily_digest.md",
)

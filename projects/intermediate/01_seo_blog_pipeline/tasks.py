import os

from crewai import Task

from agents import content_writer, seo_optimizer, seo_researcher

os.makedirs("task_outputs", exist_ok=True)

research_keywords_task = Task(
    description=(
        "Research the topic '{topic}' for an SEO-optimized blog post.\n"
        "Steps:\n"
        "1. Use the search tool to find 3-5 top-ranking articles on this topic.\n"
        "2. Identify the primary keyword, 5-8 supporting / semantic keywords, and the dominant search intent "
        "(informational, transactional, navigational).\n"
        "3. Note common headings, gaps in coverage, and angles competitors are missing."
    ),
    expected_output=(
        "## Primary keyword\n<keyword>\n\n"
        "## Supporting keywords\n- <kw>\n- <kw>\n\n"
        "## Search intent\n<one line>\n\n"
        "## Top articles\n- <title> - <one-line takeaway>\n\n"
        "## Coverage gaps\n- <gap>"
    ),
    agent=seo_researcher,
    output_file="task_outputs/keyword_research.md",
)

write_draft_task = Task(
    description=(
        "Using the keyword research, write a complete blog post (1,200-1,800 words) on '{topic}'.\n"
        "Steps:\n"
        "1. Open with a strong hook in the first 3 sentences.\n"
        "2. Use H2 / H3 structure that addresses the search intent and supporting keywords naturally.\n"
        "3. Include at least one concrete example or short case study.\n"
        "4. Close with a clear takeaway and a soft call to action."
    ),
    expected_output=(
        "A full blog post in markdown with H1, H2/H3 headings, intro, body sections, examples, and conclusion."
    ),
    agent=content_writer,
    context=[research_keywords_task],
    output_file="task_outputs/blog_draft.md",
)

seo_optimize_task = Task(
    description=(
        "Take the blog draft and optimize it for SEO.\n"
        "Steps:\n"
        "1. Restructure headings if needed for a clean H1 -> H2 -> H3 hierarchy.\n"
        "2. Increase natural usage of the primary keyword (target ~1.0-1.5% density) and weave in supporting keywords.\n"
        "3. Write an SEO meta title (under 60 characters) and a meta description (under 155 characters).\n"
        "4. Provide a readability score from 1-10 with a one-line justification.\n"
        "5. Output the final optimized post followed by a metadata block."
    ),
    expected_output=(
        "The full optimized markdown blog post, then a final block:\n"
        "---\nMeta title: <...>\nMeta description: <...>\nReadability: <1-10> - <reason>\n---"
    ),
    agent=seo_optimizer,
    context=[research_keywords_task, write_draft_task],
    output_file="task_outputs/blog_final.md",
)

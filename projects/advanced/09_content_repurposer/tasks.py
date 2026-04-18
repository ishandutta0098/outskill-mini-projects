import os

from crewai import Task

from agents import (article_reader, content_kit_assembler,
                    linkedin_post_writer, newsletter_writer,
                    twitter_thread_writer)

os.makedirs("task_outputs", exist_ok=True)

read_article_task = Task(
    description=(
        "Read the article at '{article_path}' and produce a structured outline.\n"
        "Steps:\n"
        "1. State the central thesis in one sentence.\n"
        "2. List the 3-7 supporting points in order.\n"
        "3. Pull 3 quotable lines that work as standalone hooks.\n"
        "4. Identify the target audience in one line."
    ),
    expected_output=(
        "## Outline\nThesis: ...\nSupporting points:\n1. ...\nPull quotes:\n- ...\nAudience: ..."
    ),
    agent=article_reader,
    output_file="task_outputs/article_outline.md",
)

twitter_thread_task = Task(
    description=(
        "Convert the outline into a Twitter / X thread of 8-12 tweets.\n"
        "Constraints:\n"
        "1. Tweet 1 is the hook (no emojis, must be under 220 characters).\n"
        "2. Tweets 2-N each carry one supporting point.\n"
        "3. Last tweet has a clear takeaway and a soft CTA.\n"
        "4. Each tweet under 260 characters."
    ),
    expected_output=(
        "## Twitter thread\n1/ <hook>\n2/ ...\n12/ <takeaway + CTA>"
    ),
    agent=twitter_thread_writer,
    context=[read_article_task],
    output_file="task_outputs/twitter_thread.md",
)

linkedin_post_task = Task(
    description=(
        "Convert the outline into a single LinkedIn post (1500-2200 characters).\n"
        "Constraints:\n"
        "1. Open with a one-line hook on its own line.\n"
        "2. Use short paragraphs (1-2 lines each).\n"
        "3. Include a numbered list for the supporting points.\n"
        "4. Close with one open question to drive comments."
    ),
    expected_output=(
        "## LinkedIn post\n<hook>\n\n<paragraph>\n\n<list>\n\n<question>"
    ),
    agent=linkedin_post_writer,
    context=[read_article_task],
    output_file="task_outputs/linkedin_post.md",
)

newsletter_task = Task(
    description=(
        "Convert the outline into a newsletter section (400-600 words) with a subject line.\n"
        "Constraints:\n"
        "1. Subject line under 60 characters.\n"
        "2. Open with a 1-2 sentence pull-quote treatment.\n"
        "3. Body covers the supporting points with a short personal voice.\n"
        "4. End with a tactical 'do this Monday' takeaway."
    ),
    expected_output=(
        "## Newsletter\nSubject: ...\n\n<body 400-600 words>\n\nDo this Monday: ..."
    ),
    agent=newsletter_writer,
    context=[read_article_task],
    output_file="task_outputs/newsletter.md",
)

content_kit_task = Task(
    description=(
        "Assemble the final content kit from the channel outputs above.\n"
        "Sections:\n"
        "1. One-paragraph 'kit summary' for the social manager.\n"
        "2. Twitter thread (verbatim from task).\n"
        "3. LinkedIn post (verbatim from task).\n"
        "4. Newsletter section (verbatim from task).\n"
        "5. Suggested publishing order and timing."
    ),
    expected_output=(
        "# Content Kit\n\n## Kit summary\n...\n## Twitter thread\n...\n## LinkedIn post\n...\n## Newsletter\n...\n## Publishing plan\n- ..."
    ),
    agent=content_kit_assembler,
    context=[read_article_task, twitter_thread_task, linkedin_post_task, newsletter_task],
    output_file="task_outputs/content_kit.md",
)

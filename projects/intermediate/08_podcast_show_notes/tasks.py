import os

from crewai import Task

from agents import content_summarizer, show_notes_writer, transcript_fetcher

os.makedirs("task_outputs", exist_ok=True)

fetch_transcript_task = Task(
    description=(
        "Fetch the timestamped transcript for the YouTube video '{video_url_or_id}'. "
        "Return the transcript verbatim, with each line prefixed by its [HH:MM:SS] timestamp."
    ),
    expected_output=(
        "The complete timestamped transcript, one line per snippet, prefixed with [HH:MM:SS]."
    ),
    agent=transcript_fetcher,
    output_file="task_outputs/transcript.md",
)

summarize_content_task = Task(
    description=(
        "Read the timestamped transcript and produce structured editorial notes.\n"
        "Steps:\n"
        "1. Identify 4-8 chapters. For each chapter, give a title and the start timestamp from the transcript.\n"
        "2. Pull 5-8 standout direct quotes (one sentence each) with their timestamps.\n"
        "3. List the 3-5 main themes / takeaways of the conversation.\n"
        "4. Note any tools, books, or links mentioned by the guest with the timestamp where they were mentioned."
    ),
    expected_output=(
        "## Chapters\n- [HH:MM:SS] <chapter title>\n## Quotes\n- [HH:MM:SS] \"<quote>\"\n"
        "## Themes\n- ...\n## Mentions (tools / books / links)\n- [HH:MM:SS] <thing> - <context>"
    ),
    agent=content_summarizer,
    context=[fetch_transcript_task],
    output_file="task_outputs/editorial_notes.md",
)

write_show_notes_task = Task(
    description=(
        "Produce publication-ready show notes for the episode.\n"
        "Steps:\n"
        "1. Open with a 2-3 sentence episode summary.\n"
        "2. Add a 'Listen for' section with 3 bullets that tease specific moments.\n"
        "3. Add a 'Chapters' section with timestamps in HH:MM:SS format.\n"
        "4. Add a 'Highlights' section with 3-5 quoted moments and their timestamps.\n"
        "5. Add a 'Mentioned in this episode' section listing tools, books, and links.\n"
        "6. Close with a one-line CTA (subscribe, leave a review, etc.). Stay under 600 words total."
    ),
    expected_output=(
        "# Episode show notes\n\n## Summary\n<2-3 sentences>\n\n## Listen for\n- ...\n\n"
        "## Chapters\n- HH:MM:SS - <title>\n\n## Highlights\n- HH:MM:SS - \"<quote>\"\n\n"
        "## Mentioned in this episode\n- <thing> - <one-line>\n\n## Subscribe\n<one-line CTA>"
    ),
    agent=show_notes_writer,
    context=[fetch_transcript_task, summarize_content_task],
    output_file="task_outputs/show_notes.md",
)

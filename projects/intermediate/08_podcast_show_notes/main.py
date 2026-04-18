from crewai import Crew, Process

from agents import content_summarizer, show_notes_writer, transcript_fetcher
from tasks import (fetch_transcript_task, summarize_content_task,
                   write_show_notes_task)

show_notes_crew = Crew(
    agents=[transcript_fetcher, content_summarizer, show_notes_writer],
    tasks=[fetch_transcript_task, summarize_content_task, write_show_notes_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Podcast Show Notes Generator...")
    result = show_notes_crew.kickoff(
        inputs={"video_url_or_id": "https://www.youtube.com/watch?v=qpoRO378qRY"}
    )
    print("\nDone. See task_outputs/show_notes.md for the final show notes.")

from crewai import Crew, Process

from agents import gap_finder, paper_finder, theme_summarizer
from tasks import find_gaps_task, find_papers_task, summarize_themes_task

lit_review_crew = Crew(
    agents=[paper_finder, theme_summarizer, gap_finder],
    tasks=[find_papers_task, summarize_themes_task, find_gaps_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Academic Literature Reviewer...")
    result = lit_review_crew.kickoff(
        inputs={"research_topic": "Tool use and function calling in large language models"}
    )
    print("\nDone. See task_outputs/gaps_and_future.md for the final brief.")

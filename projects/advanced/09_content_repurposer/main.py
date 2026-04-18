from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (article_reader, content_kit_assembler,
                    linkedin_post_writer, newsletter_writer,
                    twitter_thread_writer)
from tasks import (content_kit_task, linkedin_post_task, newsletter_task,
                   read_article_task, twitter_thread_task)

intake_crew = Crew(
    agents=[article_reader],
    tasks=[read_article_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

twitter_crew = Crew(
    agents=[twitter_thread_writer],
    tasks=[twitter_thread_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

linkedin_crew = Crew(
    agents=[linkedin_post_writer],
    tasks=[linkedin_post_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

newsletter_crew = Crew(
    agents=[newsletter_writer],
    tasks=[newsletter_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

assembly_crew = Crew(
    agents=[content_kit_assembler],
    tasks=[content_kit_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=15,
)


def run_content_repurposer(article_path: str) -> dict:
    inputs = {"article_path": article_path}
    outline_out = str(intake_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=3) as executor:
        twitter_future = executor.submit(twitter_crew.kickoff, inputs=inputs)
        linkedin_future = executor.submit(linkedin_crew.kickoff, inputs=inputs)
        newsletter_future = executor.submit(newsletter_crew.kickoff, inputs=inputs)
        twitter_out = str(twitter_future.result())
        linkedin_out = str(linkedin_future.result())
        newsletter_out = str(newsletter_future.result())
    kit = assembly_crew.kickoff(inputs=inputs)
    return {
        "outline": outline_out,
        "twitter": twitter_out,
        "linkedin": linkedin_out,
        "newsletter": newsletter_out,
        "content_kit": str(kit),
    }


if __name__ == "__main__":
    print("Starting Content Repurposer...")
    result = run_content_repurposer(article_path="inputs/article.md")
    print("\nDone. See task_outputs/content_kit.md for the final kit.")

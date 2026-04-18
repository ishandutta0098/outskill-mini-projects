from crewai import Crew, Process

from agents import content_writer, seo_optimizer, seo_researcher
from tasks import research_keywords_task, seo_optimize_task, write_draft_task

seo_blog_crew = Crew(
    agents=[seo_researcher, content_writer, seo_optimizer],
    tasks=[research_keywords_task, write_draft_task, seo_optimize_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting SEO Blog Post Pipeline...")
    result = seo_blog_crew.kickoff(
        inputs={"topic": "How small B2B SaaS startups should budget for AI agent infrastructure in 2026"}
    )
    print("\nPipeline complete. Final post written to task_outputs/blog_final.md")

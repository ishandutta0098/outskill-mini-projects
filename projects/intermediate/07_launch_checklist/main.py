from crewai import Crew, Process

from agents import (checklist_generator, launch_practices_researcher,
                    spec_reader)
from tasks import (build_checklist_task, read_spec_task,
                   research_practices_task)

launch_crew = Crew(
    agents=[spec_reader, launch_practices_researcher, checklist_generator],
    tasks=[read_spec_task, research_practices_task, build_checklist_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Product Launch Checklist Generator...")
    result = launch_crew.kickoff(
        inputs={"spec_file_path": "inputs/product_spec.md"}
    )
    print("\nDone. See task_outputs/launch_checklist.md for the final checklist.")

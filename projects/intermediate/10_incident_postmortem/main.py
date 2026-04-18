from crewai import Crew, Process

from agents import postmortem_writer, root_cause_investigator, timeline_parser
from tasks import (investigate_root_cause_task, parse_timeline_task,
                   write_postmortem_task)

postmortem_crew = Crew(
    agents=[timeline_parser, root_cause_investigator, postmortem_writer],
    tasks=[parse_timeline_task, investigate_root_cause_task, write_postmortem_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Incident Postmortem Drafter...")
    result = postmortem_crew.kickoff(
        inputs={"incident_file_path": "inputs/incident_timeline.txt"}
    )
    print("\nDone. See task_outputs/postmortem.md for the final postmortem.")

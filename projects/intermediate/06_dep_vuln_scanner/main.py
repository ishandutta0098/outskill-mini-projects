from crewai import Crew, Process

from agents import cve_searcher, deps_extractor, vuln_report_writer
from tasks import extract_deps_task, find_cves_task, write_report_task

vuln_scanner_crew = Crew(
    agents=[deps_extractor, cve_searcher, vuln_report_writer],
    tasks=[extract_deps_task, find_cves_task, write_report_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Dependency Vulnerability Scanner...")
    result = vuln_scanner_crew.kickoff(
        inputs={"deps_file_path": "inputs/requirements.txt"}
    )
    print("\nDone. See task_outputs/vulnerability_report.md for the prioritized report.")

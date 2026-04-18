from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (audit_report_writer, compatibility_analyst, dep_extractor,
                    license_lookup_agent, policy_research_agent)
from tasks import (audit_report_task, compatibility_task, extract_deps_task,
                   lookup_licenses_task, policy_research_task)

intake_crew = Crew(
    agents=[dep_extractor],
    tasks=[extract_deps_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

lookup_crew = Crew(
    agents=[license_lookup_agent],
    tasks=[lookup_licenses_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

policy_crew = Crew(
    agents=[policy_research_agent],
    tasks=[policy_research_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

analysis_crew = Crew(
    agents=[compatibility_analyst, audit_report_writer],
    tasks=[compatibility_task, audit_report_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)


def run_license_audit(deps_path: str) -> dict:
    inputs = {"deps_path": deps_path}
    deps_out = str(intake_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=2) as executor:
        lookup_future = executor.submit(lookup_crew.kickoff, inputs=inputs)
        policy_future = executor.submit(policy_crew.kickoff, inputs=inputs)
        lookup_out = str(lookup_future.result())
        policy_out = str(policy_future.result())
    report = analysis_crew.kickoff(inputs=inputs)
    return {
        "dependencies": deps_out,
        "license_inventory": lookup_out,
        "policy": policy_out,
        "report": str(report),
    }


if __name__ == "__main__":
    print("Starting License Auditor...")
    result = run_license_audit(deps_path="inputs/dependencies.txt")
    print("\nDone. See task_outputs/license_audit_report.md for the final report.")

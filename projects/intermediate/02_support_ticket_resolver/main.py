from crewai import Crew, Process

from agents import response_drafter, solution_searcher, ticket_analyzer
from tasks import analyze_ticket_task, draft_response_task, search_solutions_task

support_crew = Crew(
    agents=[ticket_analyzer, solution_searcher, response_drafter],
    tasks=[analyze_ticket_task, search_solutions_task, draft_response_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Support Ticket Resolver...")
    result = support_crew.kickoff(
        inputs={"ticket_file_path": "inputs/ticket.txt"}
    )
    print("\nDone. See task_outputs/customer_reply.md for the drafted reply.")

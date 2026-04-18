from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (optimization_advisor, tariff_research_agent, usage_parser,
                    weather_context_agent)
from tasks import (optimization_task, parse_usage_task, tariff_research_task,
                   weather_context_task)

intake_crew = Crew(
    agents=[usage_parser],
    tasks=[parse_usage_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

weather_crew = Crew(
    agents=[weather_context_agent],
    tasks=[weather_context_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

tariff_crew = Crew(
    agents=[tariff_research_agent],
    tasks=[tariff_research_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

advisor_crew = Crew(
    agents=[optimization_advisor],
    tasks=[optimization_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=15,
)


def run_energy_optimizer(usage_path: str) -> dict:
    inputs = {"usage_path": usage_path}
    usage_out = str(intake_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=2) as executor:
        weather_future = executor.submit(weather_crew.kickoff, inputs=inputs)
        tariff_future = executor.submit(tariff_crew.kickoff, inputs=inputs)
        weather_out = str(weather_future.result())
        tariff_out = str(tariff_future.result())
    plan = advisor_crew.kickoff(inputs=inputs)
    return {
        "usage": usage_out,
        "weather": weather_out,
        "tariff": tariff_out,
        "plan": str(plan),
    }


if __name__ == "__main__":
    print("Starting Household Energy Optimizer...")
    result = run_energy_optimizer(usage_path="inputs/usage.json")
    print("\nDone. See task_outputs/optimization_plan.md for the final plan.")

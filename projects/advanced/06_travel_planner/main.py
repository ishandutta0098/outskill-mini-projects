from concurrent.futures import ThreadPoolExecutor

from crewai import Crew, Process

from agents import (attractions_agent, destination_researcher,
                    itinerary_builder, weather_planner)
from tasks import (attractions_task, destination_brief_task, itinerary_task,
                   weather_task)

brief_crew = Crew(
    agents=[destination_researcher],
    tasks=[destination_brief_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

weather_crew = Crew(
    agents=[weather_planner],
    tasks=[weather_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

attractions_crew = Crew(
    agents=[attractions_agent],
    tasks=[attractions_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=20,
)

itinerary_crew = Crew(
    agents=[itinerary_builder],
    tasks=[itinerary_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=15,
)


def run_travel_planner(city: str, trip_days: int = 5) -> dict:
    inputs = {"city": city, "trip_days": trip_days}
    brief_out = str(brief_crew.kickoff(inputs=inputs))
    with ThreadPoolExecutor(max_workers=2) as executor:
        weather_future = executor.submit(weather_crew.kickoff, inputs=inputs)
        attractions_future = executor.submit(attractions_crew.kickoff, inputs=inputs)
        weather_out = str(weather_future.result())
        attractions_out = str(attractions_future.result())
    itinerary = itinerary_crew.kickoff(inputs=inputs)
    return {
        "brief": brief_out,
        "weather": weather_out,
        "attractions": attractions_out,
        "itinerary": str(itinerary),
    }


if __name__ == "__main__":
    print("Starting Travel Planner...")
    result = run_travel_planner(city="Lisbon", trip_days=5)
    print("\nDone. See task_outputs/itinerary.md for the final itinerary.")

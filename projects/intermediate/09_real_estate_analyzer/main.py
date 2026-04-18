from crewai import Crew, Process

from agents import buyer_advisor, listing_extractor, neighborhood_researcher
from tasks import (buyer_recommendation_task, extract_listing_task,
                   research_neighborhood_task)

real_estate_crew = Crew(
    agents=[listing_extractor, neighborhood_researcher, buyer_advisor],
    tasks=[extract_listing_task, research_neighborhood_task, buyer_recommendation_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Real Estate Listing Analyzer...")
    result = real_estate_crew.kickoff(
        inputs={"listing_file_path": "inputs/listing.txt"}
    )
    print("\nDone. See task_outputs/buyer_recommendation.md for the final advice.")

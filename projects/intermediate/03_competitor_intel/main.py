from crewai import Crew, Process

from agents import (competitor_news_researcher, competitor_position_analyst,
                    strategy_recommender)
from tasks import (analyze_position_task, gather_news_task,
                   recommend_strategy_task)

competitor_intel_crew = Crew(
    agents=[competitor_news_researcher, competitor_position_analyst, strategy_recommender],
    tasks=[gather_news_task, analyze_position_task, recommend_strategy_task],
    verbose=True,
    process=Process.sequential,
    cache=True,
    max_rpm=30,
)

if __name__ == "__main__":
    print("Starting Competitor Intelligence Report...")
    result = competitor_intel_crew.kickoff(inputs={"competitor": "Linear (linear.app)"})
    print("\nDone. See task_outputs/strategy_recommendations.md for the final brief.")

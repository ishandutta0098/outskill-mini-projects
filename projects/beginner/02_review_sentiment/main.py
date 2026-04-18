from crewai import Crew

from agents import review_sentiment_analyst
from tasks import classify_review_task

crew = Crew(
    agents=[review_sentiment_analyst],
    tasks=[classify_review_task],
    verbose=False,
)

review = (
    "The headphones arrived a day late and the box was a bit dented, but the sound is "
    "incredible for the price and battery easily lasts a full work day. Would buy again."
)

result = crew.kickoff(inputs={"review": review})

print("Response:", result)

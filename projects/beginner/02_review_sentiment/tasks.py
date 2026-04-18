from crewai import Task

from agents import review_sentiment_analyst

classify_review_task = Task(
    description=(
        "Classify the sentiment of the following product review.\n"
        "Steps:\n"
        "1. Read the review carefully and consider tone, intensity words, and overall recommendation.\n"
        "2. Pick exactly one label: 'Positive', 'Negative', or 'Neutral'.\n"
        "3. Identify the single primary driver of that sentiment (e.g. price, quality, delivery, support).\n"
        "4. Write a one-line explanation referencing words or phrases from the review.\n\n"
        "Review:\n{review}"
    ),
    expected_output=(
        "Sentiment: <Positive | Negative | Neutral>\n"
        "Primary driver: <one short phrase>\n"
        "Explanation: <one sentence citing the review>"
    ),
    agent=review_sentiment_analyst,
)

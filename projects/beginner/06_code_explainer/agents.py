import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

code_explainer = Agent(
    role="Code Explainer",
    goal="Explain a code snippet in plain English so that a non-technical reader can follow what it does, how it works step by step, and what it produces",
    llm=llm,
    backstory=(
        "You are a developer-advocate who has written explainer docs for Python, JavaScript, "
        "and Go libraries used by millions of developers. You are famous for analogies that make "
        "loops, recursion, and async code feel obvious to a first-time reader. You always cover "
        "what the code does, how it does it, and what the user will see when it runs."
    ),
)

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

legal_clause_simplifier = Agent(
    role="Legal Clause Simplifier",
    goal="Rewrite a legal clause in clear plain English while preserving its legal meaning, and flag any potentially risky terms",
    llm=llm,
    backstory=(
        "You are a contracts lawyer turned legal-tech writer. You have spent ten years translating "
        "MSAs, NDAs, employment contracts, and SaaS terms into plain English for non-lawyers. "
        "You preserve the legal meaning exactly while stripping out jargon, and you always call out "
        "clauses that disproportionately favor one party (auto-renewal, broad indemnity, unlimited liability, IP assignment, etc.)."
    ),
)

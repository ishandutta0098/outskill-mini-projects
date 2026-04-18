import os

from crewai import Agent
from crewai.llm import LLM
from dotenv import load_dotenv

from tools import exa_search_tool, jd_reader_tool

load_dotenv()

llm = LLM(
    model="openai/gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

jd_extractor = Agent(
    role="Job Description Extractor",
    goal="Read a job description file and extract role, must-haves, nice-to-haves, and signals about culture",
    llm=llm,
    backstory=(
        "You are a recruiter who has parsed thousands of JDs across engineering and product. "
        "You separate the marketing fluff from the actual hiring criteria."
    ),
    tools=[jd_reader_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=10,
)

company_researcher = Agent(
    role="Company Researcher",
    goal="Gather recent news, funding, leadership, and culture signals about the target company",
    llm=llm,
    backstory=(
        "You are a career coach who teaches candidates to walk into interviews quoting last "
        "month's product launch and last quarter's funding round. You only use credible sources."
    ),
    tools=[exa_search_tool],
    verbose=True,
    respect_context_window=True,
    max_iter=5,
    max_execution_time=600,
    max_rpm=15,
)

cover_letter_writer = Agent(
    role="Cover Letter Writer",
    goal="Write a tailored, specific cover letter that maps the candidate's strengths to the JD and references the company's recent moves",
    llm=llm,
    backstory=(
        "You are a former tech writer who has helped engineers and PMs land roles at FAANG, YC startups, "
        "and Series C companies. Your cover letters are short, specific, and never sound templated."
    ),
    verbose=True,
    respect_context_window=True,
    max_iter=3,
    max_execution_time=300,
    max_rpm=8,
)

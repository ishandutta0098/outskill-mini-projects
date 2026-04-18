import json
import os

import requests
from crewai.tools import tool
from crewai_tools import FileReadTool
from dotenv import load_dotenv

load_dotenv()

resume_reader_tool = FileReadTool()


@tool("Search live job listings via Adzuna")
def search_jobs(query: str, country: str = "in", results_per_page: int = 10) -> str:
    """Search live job postings using the free Adzuna jobs API.

    `query` is a free-text role description (e.g. 'senior backend engineer python').
    `country` is the Adzuna country code (default 'in' for India; use 'us', 'gb', etc.).
    Returns a JSON string with up to `results_per_page` jobs containing title, company,
    location, salary range, contract type, and the listing URL.
    """
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_API_KEY")
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": query,
        "results_per_page": results_per_page,
        "content-type": "application/json",
    }
    resp = requests.get(url, params=params, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    jobs = []
    for item in data.get("results", []):
        jobs.append({
            "title": item.get("title"),
            "company": (item.get("company") or {}).get("display_name"),
            "location": (item.get("location") or {}).get("display_name"),
            "salary_min": item.get("salary_min"),
            "salary_max": item.get("salary_max"),
            "contract_time": item.get("contract_time"),
            "url": item.get("redirect_url"),
            "description_snippet": (item.get("description") or "")[:400],
        })
    return json.dumps(jobs, indent=2)

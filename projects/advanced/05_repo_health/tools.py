import json
import os

import requests
from crewai.tools import tool
from crewai_tools import EXASearchTool
from dotenv import load_dotenv

load_dotenv()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

GITHUB_API = "https://api.github.com"
HEADERS = {"Accept": "application/vnd.github+json", "User-Agent": "outskill-mini-projects"}


@tool("Fetch GitHub repository metadata, top issues, and recent PRs")
def fetch_repo_health(owner_repo: str) -> str:
    """Fetch a snapshot of a public GitHub repo's health.

    `owner_repo` is in the form 'owner/name' (e.g. 'crewAIInc/crewAI').
    Returns a JSON string with stars, forks, open_issues, recent_issues, recent_prs, and last_commit.
    """
    base = f"{GITHUB_API}/repos/{owner_repo}"
    repo = requests.get(base, headers=HEADERS, timeout=20).json()
    issues = requests.get(
        f"{base}/issues",
        headers=HEADERS,
        params={"state": "open", "per_page": 10, "sort": "updated"},
        timeout=20,
    ).json()
    prs = requests.get(
        f"{base}/pulls",
        headers=HEADERS,
        params={"state": "all", "per_page": 10, "sort": "updated", "direction": "desc"},
        timeout=20,
    ).json()
    commits = requests.get(
        f"{base}/commits", headers=HEADERS, params={"per_page": 1}, timeout=20
    ).json()

    summary = {
        "full_name": repo.get("full_name"),
        "description": repo.get("description"),
        "stars": repo.get("stargazers_count"),
        "forks": repo.get("forks_count"),
        "watchers": repo.get("subscribers_count"),
        "open_issues": repo.get("open_issues_count"),
        "default_branch": repo.get("default_branch"),
        "pushed_at": repo.get("pushed_at"),
        "license": (repo.get("license") or {}).get("spdx_id"),
        "language": repo.get("language"),
        "recent_issues": [
            {
                "number": i.get("number"),
                "title": i.get("title"),
                "comments": i.get("comments"),
                "updated_at": i.get("updated_at"),
                "labels": [l.get("name") for l in i.get("labels", [])],
            }
            for i in issues
            if isinstance(i, dict) and "pull_request" not in i
        ],
        "recent_prs": [
            {
                "number": p.get("number"),
                "title": p.get("title"),
                "state": p.get("state"),
                "updated_at": p.get("updated_at"),
                "user": (p.get("user") or {}).get("login"),
            }
            for p in prs
            if isinstance(p, dict)
        ],
        "last_commit": (
            {
                "sha": commits[0].get("sha"),
                "message": (commits[0].get("commit") or {}).get("message"),
                "date": ((commits[0].get("commit") or {}).get("author") or {}).get("date"),
            }
            if commits and isinstance(commits, list)
            else None
        ),
    }
    return json.dumps(summary, indent=2)

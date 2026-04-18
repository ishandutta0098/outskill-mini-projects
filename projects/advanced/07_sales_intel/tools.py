import json
import os
import re

import requests
from bs4 import BeautifulSoup
from crewai.tools import tool
from crewai_tools import EXASearchTool, FileReadTool
from dotenv import load_dotenv

load_dotenv()

lead_reader_tool = FileReadTool()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()


@tool("Scrape a company homepage for headline, value props, and links")
def scrape_company_homepage(url: str) -> str:
    """Fetch a company homepage and extract the title, meta description, h1/h2 headlines, and the first 20 internal links."""
    headers = {"User-Agent": "Mozilla/5.0 outskill-mini-projects/1.0"}
    resp = requests.get(url, headers=headers, timeout=20)
    soup = BeautifulSoup(resp.text, "html.parser")

    title = (soup.title.string or "").strip() if soup.title else ""
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc = (meta_desc_tag.get("content") or "").strip() if meta_desc_tag else ""

    h1s = [re.sub(r"\s+", " ", h.get_text(strip=True)) for h in soup.find_all("h1")][:5]
    h2s = [re.sub(r"\s+", " ", h.get_text(strip=True)) for h in soup.find_all("h2")][:10]

    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("/") or url.split("//")[-1].split("/")[0] in href:
            text = re.sub(r"\s+", " ", a.get_text(strip=True))
            if text and 2 < len(text) < 80:
                links.append({"text": text, "href": href})
        if len(links) >= 20:
            break

    return json.dumps(
        {
            "url": url,
            "title": title,
            "meta_description": meta_desc,
            "h1": h1s,
            "h2": h2s,
            "links": links,
        },
        indent=2,
    )

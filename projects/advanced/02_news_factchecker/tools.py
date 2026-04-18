import json
import os

import feedparser
from crewai.tools import tool
from crewai_tools import EXASearchTool
from dotenv import load_dotenv

load_dotenv()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()


@tool("Fetch top headlines from a news RSS feed")
def fetch_rss_feed(feed_url: str, limit: int = 10) -> str:
    """Fetch up to `limit` recent items from an RSS / Atom news feed URL.

    Returns a JSON string with title, source, link, published date, and a short summary
    for each item. Works with any standard RSS / Atom feed (Reuters, BBC, Hacker News, etc.).
    """
    parsed = feedparser.parse(feed_url)
    source = parsed.feed.get("title", feed_url)
    items = []
    for entry in parsed.entries[:limit]:
        items.append({
            "title": entry.get("title"),
            "source": source,
            "link": entry.get("link"),
            "published": entry.get("published") or entry.get("updated"),
            "summary": (entry.get("summary") or "")[:400],
        })
    return json.dumps({"feed": source, "items": items}, indent=2)

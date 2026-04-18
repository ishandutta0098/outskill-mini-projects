import json
import os

import requests
from bs4 import BeautifulSoup
from crewai.tools import tool
from crewai_tools import EXASearchTool
from dotenv import load_dotenv

load_dotenv()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

BOOKS_BASE = "https://books.toscrape.com/catalogue/"
LISTING_URL = "https://books.toscrape.com/catalogue/page-{page}.html"


@tool("Scrape a sample e-commerce site for product listings")
def scrape_product_listings(category: str = "all", max_items: int = 20) -> str:
    """Scrape a free public e-commerce sandbox (books.toscrape.com) for product listings.

    Returns a JSON string with up to `max_items` products containing title, price (GBP),
    in-stock status, rating, and detail-page URL. Used as a stand-in for a real merchant catalog.
    The `category` argument is accepted but currently used only as a label in the response.
    """
    items = []
    page = 1
    while len(items) < max_items and page <= 5:
        resp = requests.get(LISTING_URL.format(page=page), timeout=20)
        if resp.status_code != 200:
            break
        soup = BeautifulSoup(resp.text, "html.parser")
        for article in soup.select("article.product_pod"):
            title_tag = article.select_one("h3 a")
            price_tag = article.select_one(".price_color")
            stock_tag = article.select_one(".availability")
            rating_tag = article.select_one(".star-rating")
            items.append({
                "title": title_tag["title"] if title_tag else None,
                "url": BOOKS_BASE + (title_tag["href"] if title_tag else ""),
                "price_gbp": price_tag.text.strip() if price_tag else None,
                "in_stock": stock_tag.text.strip() if stock_tag else None,
                "rating": rating_tag.get("class", [None, None])[1] if rating_tag else None,
            })
            if len(items) >= max_items:
                break
        page += 1
    return json.dumps({"category": category, "items": items}, indent=2)

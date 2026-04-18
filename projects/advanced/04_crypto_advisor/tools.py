import json
import os
from typing import List

from crewai.tools import tool
from crewai_tools import EXASearchTool, FileReadTool
from dotenv import load_dotenv
from pycoingecko import CoinGeckoAPI

load_dotenv()

portfolio_reader_tool = FileReadTool()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

_cg = CoinGeckoAPI()


@tool("Get current crypto prices in a base currency")
def get_crypto_prices(coin_ids_csv: str, base_currency: str = "usd") -> str:
    """Fetch current spot prices for one or more crypto coins.

    `coin_ids_csv` is a comma-separated list of CoinGecko coin IDs (e.g. 'bitcoin,ethereum,solana').
    `base_currency` is the fiat / quote currency (default 'usd').
    Returns a JSON string mapping coin_id -> price in `base_currency`.
    """
    coin_ids: List[str] = [c.strip() for c in coin_ids_csv.split(",") if c.strip()]
    data = _cg.get_price(ids=coin_ids, vs_currencies=base_currency)
    return json.dumps(data, indent=2)


@tool("Get crypto market context: market cap, 24h change, and 7d change")
def get_crypto_market_context(coin_ids_csv: str, base_currency: str = "usd") -> str:
    """Fetch market context (market cap, 24h price change %, 7d price change %) for given coins.

    `coin_ids_csv` is a comma-separated list of CoinGecko coin IDs.
    Returns a JSON string with one entry per coin.
    """
    coin_ids: List[str] = [c.strip() for c in coin_ids_csv.split(",") if c.strip()]
    data = _cg.get_coins_markets(
        vs_currency=base_currency,
        ids=",".join(coin_ids),
        price_change_percentage="24h,7d",
    )
    trimmed = [
        {
            "id": item.get("id"),
            "symbol": item.get("symbol"),
            "current_price": item.get("current_price"),
            "market_cap": item.get("market_cap"),
            "price_change_24h_pct": item.get("price_change_percentage_24h"),
            "price_change_7d_pct": item.get("price_change_percentage_7d_in_currency"),
        }
        for item in data
    ]
    return json.dumps(trimmed, indent=2)

import json
import os

import openmeteo_requests
import requests
import requests_cache
from crewai.tools import tool
from crewai_tools import EXASearchTool
from dotenv import load_dotenv
from retry_requests import retry

load_dotenv()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

_cache_session = requests_cache.CachedSession(".openmeteo_cache", expire_after=3600)
_retry_session = retry(_cache_session, retries=3, backoff_factor=0.3)
_om_client = openmeteo_requests.Client(session=_retry_session)


@tool("Geocode a city name to latitude and longitude using Open-Meteo")
def geocode_city(city: str) -> str:
    """Resolve a city name to its latitude, longitude, country, and timezone using Open-Meteo's free geocoding API."""
    url = "https://geocoding-api.open-meteo.com/v1/search"
    resp = requests.get(url, params={"name": city, "count": 1}, timeout=20).json()
    results = resp.get("results") or []
    if not results:
        return json.dumps({"error": f"No geocoding match for '{city}'"})
    r = results[0]
    return json.dumps(
        {
            "city": r.get("name"),
            "country": r.get("country"),
            "latitude": r.get("latitude"),
            "longitude": r.get("longitude"),
            "timezone": r.get("timezone"),
        },
        indent=2,
    )


@tool("Get a daily weather forecast for a coordinate using Open-Meteo")
def get_weather_forecast(latitude: float, longitude: float, days: int = 7) -> str:
    """Return a daily weather forecast (temperature max/min in C, precipitation mm, weather code) for the next `days` days at the given coordinates."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
        "forecast_days": min(max(days, 1), 16),
        "timezone": "auto",
    }
    responses = _om_client.weather_api(url, params=params)
    response = responses[0]
    daily = response.Daily()
    out = {
        "latitude": response.Latitude(),
        "longitude": response.Longitude(),
        "timezone": response.Timezone(),
        "days": [],
    }
    tmax = daily.Variables(0).ValuesAsNumpy()
    tmin = daily.Variables(1).ValuesAsNumpy()
    precip = daily.Variables(2).ValuesAsNumpy()
    codes = daily.Variables(3).ValuesAsNumpy()
    for i in range(len(tmax)):
        out["days"].append(
            {
                "day_index": i,
                "temp_max_c": float(tmax[i]),
                "temp_min_c": float(tmin[i]),
                "precip_mm": float(precip[i]),
                "weather_code": int(codes[i]),
            }
        )
    return json.dumps(out, indent=2)


@tool("Fetch a short Wikipedia summary about a place")
def get_wikipedia_summary(title: str) -> str:
    """Fetch a short Wikipedia summary (extract) for the given page title using Wikipedia's REST API."""
    safe = title.replace(" ", "_")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{safe}"
    data = requests.get(url, timeout=20, headers={"User-Agent": "outskill-mini-projects"}).json()
    return json.dumps(
        {
            "title": data.get("title"),
            "description": data.get("description"),
            "extract": data.get("extract"),
            "url": (data.get("content_urls") or {}).get("desktop", {}).get("page"),
        },
        indent=2,
    )

import json
import os

import openmeteo_requests
import requests_cache
from crewai.tools import tool
from crewai_tools import EXASearchTool, FileReadTool
from dotenv import load_dotenv
from retry_requests import retry

load_dotenv()

usage_reader_tool = FileReadTool()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

_cache_session = requests_cache.CachedSession(".openmeteo_energy_cache", expire_after=3600)
_retry_session = retry(_cache_session, retries=3, backoff_factor=0.3)
_om_client = openmeteo_requests.Client(session=_retry_session)


@tool("Get daily temperature forecast (max/min) for a coordinate")
def get_temperature_forecast(latitude: float, longitude: float, days: int = 7) -> str:
    """Return a daily temperature forecast (temp max C, temp min C, apparent temp max C) for the next `days` days using Open-Meteo."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,apparent_temperature_max",
        "forecast_days": min(max(days, 1), 16),
        "timezone": "auto",
    }
    responses = _om_client.weather_api(url, params=params)
    response = responses[0]
    daily = response.Daily()
    tmax = daily.Variables(0).ValuesAsNumpy()
    tmin = daily.Variables(1).ValuesAsNumpy()
    apparent = daily.Variables(2).ValuesAsNumpy()
    out = {
        "latitude": response.Latitude(),
        "longitude": response.Longitude(),
        "timezone": response.Timezone(),
        "days": [
            {
                "day_index": i,
                "temp_max_c": float(tmax[i]),
                "temp_min_c": float(tmin[i]),
                "apparent_max_c": float(apparent[i]),
            }
            for i in range(len(tmax))
        ],
    }
    return json.dumps(out, indent=2)

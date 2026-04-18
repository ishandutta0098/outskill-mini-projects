import json
import os
import re

import requests
from crewai.tools import tool
from crewai_tools import EXASearchTool, FileReadTool
from dotenv import load_dotenv

load_dotenv()

deps_reader_tool = FileReadTool()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

PYPI_JSON = "https://pypi.org/pypi/{name}/json"


@tool("Look up license metadata for a Python package from PyPI")
def get_pypi_license(package_name: str) -> str:
    """Fetch license info, summary, homepage, and author for a single PyPI package.

    `package_name` is the PyPI distribution name (e.g. 'requests'). Returns a JSON string with
    name, version, license, summary, home_page, author, and the SPDX-style license classifier if present.
    """
    name = re.split(r"[<>=!~ ]", package_name.strip(), maxsplit=1)[0]
    url = PYPI_JSON.format(name=name)
    data = requests.get(url, timeout=20).json()
    info = data.get("info") or {}
    classifiers = info.get("classifiers") or []
    license_classifier = next(
        (c for c in classifiers if c.startswith("License ::")),
        None,
    )
    return json.dumps(
        {
            "name": info.get("name") or name,
            "version": info.get("version"),
            "license": info.get("license"),
            "license_classifier": license_classifier,
            "summary": info.get("summary"),
            "home_page": info.get("home_page"),
            "author": info.get("author"),
            "project_url": info.get("project_url"),
        },
        indent=2,
    )

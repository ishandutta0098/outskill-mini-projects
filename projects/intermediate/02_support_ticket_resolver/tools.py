import os

from crewai_tools import EXASearchTool, FileReadTool
from dotenv import load_dotenv

load_dotenv()

ticket_reader_tool = FileReadTool()

os.environ["EXA_API_KEY"] = os.getenv("EXA_API_KEY")
exa_search_tool = EXASearchTool()

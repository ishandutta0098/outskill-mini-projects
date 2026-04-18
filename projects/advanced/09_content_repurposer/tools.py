import os

from crewai_tools import FileReadTool
from dotenv import load_dotenv

load_dotenv()

article_reader_tool = FileReadTool()

import re

from crewai.tools import tool
from youtube_transcript_api import YouTubeTranscriptApi


def _extract_video_id(url_or_id: str) -> str:
    if len(url_or_id) == 11 and re.match(r"^[A-Za-z0-9_-]{11}$", url_or_id):
        return url_or_id
    patterns = [
        r"(?:v=|/v/|youtu\.be/|/embed/|/shorts/)([A-Za-z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    return url_or_id


@tool("Fetch YouTube transcript with timestamps")
def fetch_youtube_transcript(video_url_or_id: str) -> str:
    """Fetch the transcript of a YouTube video by URL or 11-character video ID.

    Returns the transcript as a single string with each line prefixed by its start
    time in [HH:MM:SS] format, suitable for an agent to summarize and turn into
    show notes with chapter markers.
    """
    video_id = _extract_video_id(video_url_or_id)

    api = YouTubeTranscriptApi()
    fetched = api.fetch(video_id)

    lines = []
    for snippet in fetched.snippets:
        seconds = int(snippet.start)
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        timestamp = f"[{hours:02d}:{minutes:02d}:{secs:02d}]"
        text = snippet.text.replace("\n", " ").strip()
        lines.append(f"{timestamp} {text}")

    return "\n".join(lines)

from crewai import Task

from agents import meeting_notes_summarizer

summarize_meeting_task = Task(
    description=(
        "Summarize the meeting transcript into structured notes.\n"
        "Steps:\n"
        "1. Read the transcript and identify what was actually decided.\n"
        "2. Extract every action item with the owner and deadline as stated in the transcript.\n"
        "3. List any deadlines or dates that were mentioned, even if not tied to a specific action.\n"
        "4. Capture any open questions that were raised but not resolved.\n"
        "5. If an owner or deadline was never stated, write 'Unassigned' or 'No deadline mentioned'.\n\n"
        "Transcript:\n{transcript}"
    ),
    expected_output=(
        "## Decisions\n- <decision 1>\n- <decision 2>\n\n"
        "## Action Items\n- [Owner] <action> (Deadline: <date or 'No deadline mentioned'>)\n\n"
        "## Deadlines\n- <date>: <what is due>\n\n"
        "## Open Questions\n- <question 1>\n- <question 2>"
    ),
    agent=meeting_notes_summarizer,
)

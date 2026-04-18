from crewai import Task

from agents import email_tone_rewriter

rewrite_email_task = Task(
    description=(
        "Rewrite the draft email below to match the requested tone, while keeping the same "
        "meaning, facts, recipients, dates, and asks.\n"
        "Steps:\n"
        "1. Identify the core ask, facts, and any dates or numbers in the original email.\n"
        "2. Adjust phrasing, greetings, and sign-off so the email reads as the requested tone "
        "('formal', 'friendly', 'apologetic', 'urgent', etc.).\n"
        "3. Do NOT add new commitments, deadlines, or facts that are not in the original.\n"
        "4. Keep the rewritten email roughly the same length as the original.\n\n"
        "Tone: {tone}\n\n"
        "Original email:\n{email}"
    ),
    expected_output=(
        "Subject: <rewritten subject line>\n\n<rewritten email body in the requested tone>"
    ),
    agent=email_tone_rewriter,
)

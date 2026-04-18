from crewai import Task

from agents import cold_outreach_writer

write_outreach_task = Task(
    description=(
        "Write a personalized cold outreach email from the seller of {product} to a buyer at {company}.\n"
        "Steps:\n"
        "1. Infer one likely pain point that {company} probably has, based on their industry and size.\n"
        "2. Write a subject line under 8 words that hints at that pain.\n"
        "3. Open with one specific observation about {company} (no generic flattery).\n"
        "4. Connect the pain point to {product} in 2-3 sentences, focused on outcomes not features.\n"
        "5. End with a single clear call to action (a 15-minute call next week is a safe default).\n"
        "Keep the whole email under 120 words.\n\n"
        "Target company: {company}\n"
        "Product / service to pitch: {product}"
    ),
    expected_output=(
        "Subject: <subject line>\n\nHi <first name guess>,\n\n<email body in 3 short paragraphs>\n\nThanks,\n<sender>"
    ),
    agent=cold_outreach_writer,
)

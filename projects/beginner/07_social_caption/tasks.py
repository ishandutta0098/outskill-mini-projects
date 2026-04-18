from crewai import Task

from agents import social_caption_writer

write_caption_task = Task(
    description=(
        "Write a single optimized social media caption for {platform} based on the description below.\n"
        "Platform rules to follow:\n"
        "- Twitter / X: under 240 characters, punchy, 1-2 relevant hashtags, no emoji walls.\n"
        "- LinkedIn: 3-5 short paragraphs, hook in the first line, professional tone, 0-3 hashtags.\n"
        "- Instagram: warm conversational tone, 2-4 short lines, line breaks for readability, "
        "8-15 hashtags at the end, light emoji use.\n"
        "Steps:\n"
        "1. Read the description and pick the single most interesting angle.\n"
        "2. Match the tone, length, and formatting to {platform}.\n"
        "3. Add hashtags only in the style that fits the platform.\n\n"
        "Description:\n{description}\n\n"
        "Target platform: {platform}"
    ),
    expected_output=(
        "Platform: {platform}\nCaption:\n<the final caption, ready to paste>\n\nHashtags: <space-separated list or 'n/a'>"
    ),
    agent=social_caption_writer,
)

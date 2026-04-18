import os

from crewai import Task

from agents import (checklist_generator, launch_practices_researcher,
                    spec_reader)

os.makedirs("task_outputs", exist_ok=True)

read_spec_task = Task(
    description=(
        "Read the product spec at {spec_file_path} and extract:\n"
        "1. Product name and one-line description.\n"
        "2. Target launch date and how many weeks out it is.\n"
        "3. Target audience.\n"
        "4. In-scope features for v1.\n"
        "5. Distribution channels.\n"
        "6. Success metrics.\n"
        "7. Known risks."
    ),
    expected_output=(
        "## Product\n<name + one-line>\n## Launch date\n<date> (<n weeks out>)\n## Audience\n- ...\n"
        "## In-scope features\n- ...\n## Distribution\n- ...\n## Success metrics\n- ...\n## Risks\n- ..."
    ),
    agent=spec_reader,
    output_file="task_outputs/spec_summary.md",
)

research_practices_task = Task(
    description=(
        "Research recent launches comparable to this product and the playbooks that worked.\n"
        "Steps:\n"
        "1. Find 3-5 launches in the same category in the last 12 months.\n"
        "2. Identify the channels they used (App Store, Product Hunt, blog, webinar, sales-led, etc.).\n"
        "3. Note any common pre-launch checklist items (beta, App Store review buffer, comms freeze, etc.).\n"
        "4. Capture 2-3 lessons from launches that struggled."
    ),
    expected_output=(
        "## Comparable launches\n- <product>: <channels + outcome>\n## Recurring playbook items\n- ...\n## Pitfalls\n- ..."
    ),
    agent=launch_practices_researcher,
    context=[read_spec_task],
    output_file="task_outputs/launch_research.md",
)

build_checklist_task = Task(
    description=(
        "Build a complete go-to-market checklist for this launch.\n"
        "Steps:\n"
        "1. Organize tasks by phase: Pre-Launch (T-8 to T-1 weeks), Launch Week (T-0), Post-Launch (T+1 to T+4 weeks).\n"
        "2. Each task must include: function (Eng / PMM / Sales / CS / Support / Legal / Comms), owner placeholder, "
        "deadline relative to launch (e.g. T-3 weeks), and a one-line outcome.\n"
        "3. Include channel strategy: which channels we will use and why.\n"
        "4. Include risk mitigations specific to this product (App Store review, push reliability, cold start).\n"
        "5. End with a 'Day 1 morning of launch' run-of-show."
    ),
    expected_output=(
        "## Pre-Launch (T-8 -> T-1)\n- [Function] <task> - Owner: <name placeholder> - Deadline: <T-X> - Outcome: <...>\n\n"
        "## Launch Week\n- ...\n\n## Post-Launch (T+1 -> T+4)\n- ...\n\n## Channel strategy\n- ...\n\n"
        "## Risk mitigations\n- ...\n\n## Day-1 run of show\n1. ..."
    ),
    agent=checklist_generator,
    context=[read_spec_task, research_practices_task],
    output_file="task_outputs/launch_checklist.md",
)

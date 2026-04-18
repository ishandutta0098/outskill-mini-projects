import os

from crewai import Task

from agents import postmortem_writer, root_cause_investigator, timeline_parser

os.makedirs("task_outputs", exist_ok=True)

parse_timeline_task = Task(
    description=(
        "Read the incident report at {incident_file_path} and produce a clean timeline.\n"
        "Steps:\n"
        "1. Capture incident ID, severity, services, and customer impact (with $ if available).\n"
        "2. Build a chronological timeline marking: detect (T+0), escalate, identify, mitigate, resolve.\n"
        "3. Compute time-to-detect, time-to-mitigate, and time-to-resolve relative to T+0.\n"
        "4. Note any operational facts (deploy that triggered, pool sizes, on-call names)."
    ),
    expected_output=(
        "## Incident summary\n- ID, severity, services, impact\n## Timeline\n- T+00:00 - <event>\n- T+00:02 - <event>\n"
        "## Key metrics\n- TTD: ...\n- TTM: ...\n- TTR: ...\n## Operational facts\n- ..."
    ),
    agent=timeline_parser,
    output_file="task_outputs/timeline.md",
)

investigate_root_cause_task = Task(
    description=(
        "Identify root and contributing causes for the incident using a 5-Whys approach plus a contributing-factors list.\n"
        "Steps:\n"
        "1. State the trigger (the immediate proximate cause).\n"
        "2. Run 5 Whys to surface the deeper cause.\n"
        "3. List contributing factors (latent conditions): tooling, review, monitoring, capacity, processes.\n"
        "4. Note what worked well during response (don't only list failures)."
    ),
    expected_output=(
        "## Trigger\n<one line>\n## 5 Whys\n1. Why did <X>? Because <Y>.\n... (5 levels)\n## Root cause\n<paragraph>\n"
        "## Contributing factors\n- ...\n## What worked well\n- ..."
    ),
    agent=root_cause_investigator,
    context=[parse_timeline_task],
    output_file="task_outputs/root_cause.md",
)

write_postmortem_task = Task(
    description=(
        "Draft the final blameless postmortem document.\n"
        "Steps:\n"
        "1. Use this section order: Summary, Customer impact, Timeline, Root cause, Contributing factors, "
        "What went well, What went poorly, Lessons learned, Action items.\n"
        "2. Tone must be blameless: never name an individual as 'caused this'. Refer to roles ('the on-call engineer'), not blame.\n"
        "3. Action items must include: action, owner role, deadline (relative date if absolute not given), and category (Prevent | Detect | Respond)."
    ),
    expected_output=(
        "# Postmortem: <ID>\n\n## Summary\n...\n## Customer impact\n...\n## Timeline\n...\n"
        "## Root cause\n...\n## Contributing factors\n...\n## What went well\n...\n## What went poorly\n...\n"
        "## Lessons learned\n...\n## Action items\n- [Prevent] <action> - Owner: <role> - Deadline: <date>"
    ),
    agent=postmortem_writer,
    context=[parse_timeline_task, investigate_root_cause_task],
    output_file="task_outputs/postmortem.md",
)

import os

from crewai import Task

from agents import (audit_report_writer, compatibility_analyst, dep_extractor,
                    license_lookup_agent, policy_research_agent)

os.makedirs("task_outputs", exist_ok=True)

extract_deps_task = Task(
    description=(
        "Read the dependency manifest at '{deps_path}'. Strip blanks, comments, and version "
        "specifiers. Output a clean, deduped list of (name, version)."
    ),
    expected_output=(
        "## Dependencies\n- <name>==<version>\n- ..."
    ),
    agent=dep_extractor,
    output_file="task_outputs/dependencies_clean.md",
)

lookup_licenses_task = Task(
    description=(
        "For every dependency from the previous step, call get_pypi_license to fetch its license "
        "metadata. Build one row per package."
    ),
    expected_output=(
        "## License inventory\n| package | version | license | classifier | summary |\n|---|---|---|---|---|"
    ),
    agent=license_lookup_agent,
    context=[extract_deps_task],
    output_file="task_outputs/license_inventory.md",
)

policy_research_task = Task(
    description=(
        "Search the web for current best practices on Python OSS license usage in closed-source "
        "SaaS products (last 2 years).\n"
        "Steps:\n"
        "1. Identify which licenses are typically blockers (e.g. AGPL, SSPL).\n"
        "2. Identify which licenses are typically safe (MIT, BSD, Apache-2.0).\n"
        "3. Capture 3-5 sources."
    ),
    expected_output=(
        "## License policy guidance\n### Permissive (safe)\n- ...\n### High-risk for SaaS\n- ...\n### Sources\n- <url>"
    ),
    agent=policy_research_agent,
    output_file="task_outputs/license_policy.md",
)

compatibility_task = Task(
    description=(
        "Classify each dependency's license as Permissive / Weak Copyleft / Strong Copyleft / Unknown.\n"
        "Steps:\n"
        "1. Use the license inventory and the policy guidance.\n"
        "2. Flag any GPL / AGPL / LGPL / SSPL as High Risk.\n"
        "3. Flag any 'UNKNOWN', empty, or missing license as Must Resolve.\n"
        "4. Output a table sorted by risk (High first, then Medium, then Low)."
    ),
    expected_output=(
        "## Compatibility analysis\n| package | license | category | risk | note |\n|---|---|---|---|---|"
    ),
    agent=compatibility_analyst,
    context=[lookup_licenses_task, policy_research_task],
    output_file="task_outputs/license_compatibility.md",
)

audit_report_task = Task(
    description=(
        "Write the final license audit report.\n"
        "Sections:\n"
        "1. Overall risk tier for the release (Green / Yellow / Red).\n"
        "2. Blockers (anything Must Resolve or High Risk) with named remediation.\n"
        "3. Watchlist (Medium risk).\n"
        "4. Approved (Low risk).\n"
        "5. Recommended OSPO actions for the next 90 days."
    ),
    expected_output=(
        "# License Audit Report\n\n## Overall risk: <tier>\n## Blockers\n- ...\n## Watchlist\n- ...\n## Approved\n- ...\n## OSPO actions\n- ..."
    ),
    agent=audit_report_writer,
    context=[lookup_licenses_task, policy_research_task, compatibility_task],
    output_file="task_outputs/license_audit_report.md",
)

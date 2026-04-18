import os

from crewai import Task

from agents import cve_searcher, deps_extractor, vuln_report_writer

os.makedirs("task_outputs", exist_ok=True)

extract_deps_task = Task(
    description=(
        "Read the dependency file at {deps_file_path} and extract every declared package + version.\n"
        "Steps:\n"
        "1. Read the entire file.\n"
        "2. List each package and its pinned version (or version range).\n"
        "3. Note the ecosystem (PyPI, npm, etc.) based on the file format."
    ),
    expected_output=(
        "## Ecosystem\n<PyPI | npm | other>\n## Packages\n- <name>: <version>\n- <name>: <version>"
    ),
    agent=deps_extractor,
    output_file="task_outputs/deps_list.md",
)

find_cves_task = Task(
    description=(
        "For each package + version from the previous task, search for known CVEs and security advisories.\n"
        "Steps:\n"
        "1. For each package, search the NVD, GitHub Advisory Database, OSV, or vendor security pages.\n"
        "2. Capture: CVE ID (or advisory ID), severity (CVSS or Critical/High/Medium/Low), affected versions, fixed-in version, source URL.\n"
        "3. If a package has no known issues, say so explicitly."
    ),
    expected_output=(
        "## Findings\n### <package>==<version>\n- <CVE id> - <severity> - affected: <range> - fixed in: <ver> - <url>\n"
        "(repeat per package; mark 'No known advisories' where appropriate)"
    ),
    agent=cve_searcher,
    context=[extract_deps_task],
    output_file="task_outputs/cve_findings.md",
)

write_report_task = Task(
    description=(
        "Produce a final prioritized vulnerability report.\n"
        "Steps:\n"
        "1. Sort findings by severity (Critical -> High -> Medium -> Low).\n"
        "2. For each finding, recommend a specific upgrade path (target version) and any breaking-change notes.\n"
        "3. Add an executive summary with total count by severity and the top 3 things to fix this week.\n"
        "4. Add a section listing packages with no known issues."
    ),
    expected_output=(
        "## Executive summary\n<paragraph + counts>\n## Top 3 fixes this week\n- ...\n"
        "## Findings (sorted by severity)\n### <package>\n- Severity: <...>\n- Fix: upgrade to <version>\n- Notes: <breaking-change risk>\n"
        "## Clean packages\n- <pkg>"
    ),
    agent=vuln_report_writer,
    context=[extract_deps_task, find_cves_task],
    output_file="task_outputs/vulnerability_report.md",
)

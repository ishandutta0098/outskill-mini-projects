import os

from crewai import Task

from agents import gap_finder, paper_finder, theme_summarizer

os.makedirs("task_outputs", exist_ok=True)

find_papers_task = Task(
    description=(
        "Find recent (last 2-3 years) high-quality papers and articles on the research topic '{research_topic}'.\n"
        "Steps:\n"
        "1. Search for both peer-reviewed papers and preprints (arXiv, etc.).\n"
        "2. Aim for 8-12 sources covering the dominant approaches and any contrarian work.\n"
        "3. For each, capture: title, authors (or first author + et al.), year, venue / source, and a one-line abstract."
    ),
    expected_output=(
        "## Sources\n1. <Title> - <Authors> (<Year>, <Venue>) - <one-line abstract> - <url>\n... (8-12 entries)"
    ),
    agent=paper_finder,
    output_file="task_outputs/sources.md",
)

summarize_themes_task = Task(
    description=(
        "Summarize the key themes, methodologies, and conclusions across the discovered sources.\n"
        "Steps:\n"
        "1. Cluster the papers into 3-5 themes.\n"
        "2. For each theme, describe the typical methodology and the consensus finding.\n"
        "3. Cite the source numbers from the sources list to back each claim."
    ),
    expected_output=(
        "## Themes\n### Theme 1: <name>\nMethodology: <...>\nConsensus: <...>\nKey sources: [1, 3, 7]\n\n... (3-5 themes)"
    ),
    agent=theme_summarizer,
    context=[find_papers_task],
    output_file="task_outputs/themes.md",
)

find_gaps_task = Task(
    description=(
        "Identify research gaps, contradictions, and future directions for '{research_topic}'.\n"
        "Steps:\n"
        "1. List 3-5 unresolved questions the literature has not yet answered.\n"
        "2. List 1-3 places where studies actively disagree.\n"
        "3. Suggest 3 concrete future research directions a PhD student could pursue this year.\n"
        "4. End with a one-paragraph 'state of the field' summary."
    ),
    expected_output=(
        "## Open questions\n- ...\n## Contradictions\n- ...\n## Future directions\n1. ...\n## State of the field\n<paragraph>"
    ),
    agent=gap_finder,
    context=[find_papers_task, summarize_themes_task],
    output_file="task_outputs/gaps_and_future.md",
)

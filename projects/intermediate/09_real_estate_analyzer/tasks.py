import os

from crewai import Task

from agents import buyer_advisor, listing_extractor, neighborhood_researcher

os.makedirs("task_outputs", exist_ok=True)

extract_listing_task = Task(
    description=(
        "Read the listing at {listing_file_path} and extract the structured details.\n"
        "Steps:\n"
        "1. Capture: asking price, carpet/built-up area, configuration, age, floor, society, facing, possession.\n"
        "2. Capture monthly maintenance and any recurring costs.\n"
        "3. Capture amenities and location (street + nearest landmarks).\n"
        "4. Note any deal signals from the seller's remarks (e.g. 'motivated seller')."
    ),
    expected_output=(
        "## Listing summary\n- Address: ...\n- Asking price: ...\n- Carpet / built-up: ...\n"
        "- Configuration: ...\n- Age + RERA: ...\n- Maintenance + tax: ...\n- Amenities: ...\n"
        "- Deal signals: ..."
    ),
    agent=listing_extractor,
    output_file="task_outputs/listing_summary.md",
)

research_neighborhood_task = Task(
    description=(
        "Research the locality of this listing.\n"
        "Steps:\n"
        "1. Find the typical price per sq ft for similar 3 BHK apartments in this micro-market in the last 6-12 months.\n"
        "2. Identify reputable schools, hospitals, and grocery options within 3 km.\n"
        "3. Check commute realities to nearby tech parks (peak vs off-peak).\n"
        "4. Note any major upcoming infrastructure (metro extension, road widening) that could move prices.\n"
        "5. Note any safety, water, or flooding history if surfaced in news."
    ),
    expected_output=(
        "## Comparable rate (INR / sq ft)\n<range + sources>\n## Schools & amenities\n- ...\n"
        "## Commute reality\n- ...\n## Infra catalysts\n- ...\n## Risks\n- ..."
    ),
    agent=neighborhood_researcher,
    context=[extract_listing_task],
    output_file="task_outputs/neighborhood_research.md",
)

buyer_recommendation_task = Task(
    description=(
        "Produce a buyer recommendation for this listing.\n"
        "Steps:\n"
        "1. Compute implied rate per sq ft (asking price / carpet area) and compare to the locality range.\n"
        "2. Score the listing 1-10 on value-for-money, livability, and resale potential (separate scores).\n"
        "3. Suggest a target negotiation price with justification.\n"
        "4. End with one verdict: 'Pursue at asking', 'Negotiate to <price>', or 'Pass'.\n"
        "5. Add a checklist of due diligence items the buyer must verify before signing."
    ),
    expected_output=(
        "## Implied vs market rate\n<numbers>\n## Scores\n- Value: <1-10>\n- Livability: <1-10>\n- Resale: <1-10>\n"
        "## Target price\n<INR amount + reasoning>\n## Verdict\n<Pursue / Negotiate / Pass>\n## Due diligence checklist\n- ..."
    ),
    agent=buyer_advisor,
    context=[extract_listing_task, research_neighborhood_task],
    output_file="task_outputs/buyer_recommendation.md",
)

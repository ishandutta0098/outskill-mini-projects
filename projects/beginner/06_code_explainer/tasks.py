from crewai import Task

from agents import code_explainer

explain_code_task = Task(
    description=(
        "Explain the following code snippet to a non-technical reader.\n"
        "Steps:\n"
        "1. State in one sentence what the code as a whole does.\n"
        "2. Walk through the code step by step in plain English. Use everyday analogies where helpful.\n"
        "3. Describe what the user would see if they ran this code (printed output, return value, side effects).\n"
        "4. Note any inputs the reader would need to provide and any obvious limitations.\n"
        "Avoid jargon. Do not include the original code in your answer.\n\n"
        "Code:\n{code}"
    ),
    expected_output=(
        "## What it does\n<one sentence>\n\n"
        "## How it works\n1. <step>\n2. <step>\n3. <step>\n\n"
        "## What you would see\n<plain English description of output>\n\n"
        "## Inputs and limitations\n- <input or limitation>"
    ),
    agent=code_explainer,
)

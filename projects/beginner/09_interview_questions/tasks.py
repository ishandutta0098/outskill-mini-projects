from crewai import Task

from agents import interview_question_designer

generate_questions_task = Task(
    description=(
        "Generate exactly 10 interview questions for the role '{role}' at '{level}' seniority "
        "('junior', 'mid', 'senior', or 'lead').\n"
        "Steps:\n"
        "1. Choose a mix appropriate to the seniority: at junior more technical and basic behavioral, "
        "at lead more strategic, leadership, and architectural / cross-functional questions.\n"
        "2. Aim for roughly 5 technical, 3 behavioral, and 2 situational questions.\n"
        "3. For each question, write a short 'Strong answer signals' note (1-2 lines) describing "
        "what a great candidate would mention.\n"
        "4. Number the questions 1 through 10.\n\n"
        "Role: {role}\nLevel: {level}"
    ),
    expected_output=(
        "1. <question>\n   Strong answer signals: <what a great answer covers>\n"
        "2. <question>\n   Strong answer signals: ...\n"
        "... (10 total questions)"
    ),
    agent=interview_question_designer,
)

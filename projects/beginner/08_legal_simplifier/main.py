from crewai import Crew

from agents import legal_clause_simplifier
from tasks import simplify_clause_task

crew = Crew(
    agents=[legal_clause_simplifier],
    tasks=[simplify_clause_task],
    verbose=False,
)

clause = (
    "This Agreement shall automatically renew for successive one (1) year terms unless either "
    "Party provides written notice of non-renewal at least ninety (90) days prior to the end of "
    "the then-current term. Customer agrees to indemnify, defend, and hold harmless Provider and "
    "its affiliates from and against any and all claims, damages, liabilities, costs and expenses "
    "(including reasonable attorneys' fees) arising out of or related to Customer's use of the Services."
)

result = crew.kickoff(inputs={"clause": clause})

print("Response:", result)

from crewai import Crew

from agents import meeting_notes_summarizer
from tasks import summarize_meeting_task

crew = Crew(
    agents=[meeting_notes_summarizer],
    tasks=[summarize_meeting_task],
    verbose=False,
)

transcript = """
Anita: Okay team, quick sync on the Q3 launch. The big question is whether we ship the
billing redesign on July 28 or push to August 4.

Rohan: Engineering wise, July 28 is doable but tight. We still have the Stripe webhook bug
open. I can have a fix in code review by Wednesday.

Anita: Let's commit to July 28 then. Rohan, you own the Stripe fix, deadline this Wednesday.

Maya: For marketing, the email blast and changelog post need final copy by July 25. I'll draft
both and circulate for review on Monday.

Anita: Great. One open question - do we want a webinar at launch? Let's table that for now and
revisit at next week's sync.

Rohan: Also, who's covering on-call the day of launch?

Anita: Good catch, we'll figure that out separately.
"""

result = crew.kickoff(inputs={"transcript": transcript})

print("Response:", result)

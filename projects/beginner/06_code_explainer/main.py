from crewai import Crew

from agents import code_explainer
from tasks import explain_code_task

crew = Crew(
    agents=[code_explainer],
    tasks=[explain_code_task],
    verbose=False,
)

code = '''
def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

fizzbuzz(20)
'''

result = crew.kickoff(inputs={"code": code})

print("Response:", result)

import os
import shutil
import tempfile

import uvicorn
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel

from main import run_hiring_pipeline

app = FastAPI(
    title="AI Hiring Pipeline API",
    description="Upload a resume and get a candidate profile, matched jobs, screening brief, and outreach emails.",
    version="0.1.0",
)


class PipelineResponse(BaseModel):
    candidate_profile: str
    screening_and_outreach: str


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/hiring/run", response_model=PipelineResponse)
async def run_pipeline(resume: UploadFile = File(...)) -> PipelineResponse:
    suffix = os.path.splitext(resume.filename or "resume.txt")[1] or ".txt"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(resume.file, tmp)
        tmp_path = tmp.name
    result = run_hiring_pipeline(tmp_path)
    return PipelineResponse(**result)


if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8001, reload=False)

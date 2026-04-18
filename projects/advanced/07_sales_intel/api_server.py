import json
import os
import tempfile

import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

from main import run_sales_intel

app = FastAPI(
    title="Sales Intelligence API",
    description="Submit a B2B lead and receive a positioning brief, news triggers, lead score, and outreach sequence.",
    version="0.1.0",
)


class LeadRequest(BaseModel):
    company: str
    website: str
    industry: str = ""
    target_persona: str = ""
    our_product: str = ""


class SalesIntelResponse(BaseModel):
    lead: str
    site: str
    news: str
    sequence: str


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/sales/run", response_model=SalesIntelResponse)
def run_pipeline(lead: LeadRequest) -> SalesIntelResponse:
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json") as tmp:
        json.dump(lead.model_dump(), tmp)
        tmp_path = tmp.name
    result = run_sales_intel(tmp_path)
    os.unlink(tmp_path)
    return SalesIntelResponse(**result)


if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8002, reload=False)

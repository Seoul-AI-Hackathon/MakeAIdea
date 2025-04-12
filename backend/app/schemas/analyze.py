from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    project_id: str
    title: str
    summary: str
    url: str
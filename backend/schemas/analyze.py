from pydantic import BaseModel

class AnalyzeResponse(BaseModel):
    project_id: str
    title: str
    summary: str

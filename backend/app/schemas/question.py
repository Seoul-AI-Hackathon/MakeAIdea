from pydantic import BaseModel
from datetime import datetime

class QuestionCreate(BaseModel):
    question: str

class QuestionOut(BaseModel):
    id: int
    node_id: int
    question: str
    score: int
    created_at: datetime

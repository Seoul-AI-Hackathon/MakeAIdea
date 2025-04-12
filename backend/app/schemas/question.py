from pydantic import BaseModel
from datetime import datetime

class QuestionCreate(BaseModel):
    question: str

class QuestionUpdate(BaseModel):
    question: str | None = None
    score: int | None = None

class QuestionOut(BaseModel):
    id: int
    node_id: int
    question: str
    score: int
    created_at: datetime

class AnswerCreate(BaseModel):
    answer: str

from pydantic import BaseModel

class UserAnswerIn(BaseModel):
    answer_user: str

class ScoreOut(BaseModel):
    score: int
    feedback: str

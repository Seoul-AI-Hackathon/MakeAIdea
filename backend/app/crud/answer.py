# app/crud/answer.py
from sqlalchemy.orm import Session
from app.models.answer import NodeAnswerAI

def create_ai_answer(db: Session, question_id: int, answer_ai: str):
    answer = NodeAnswerAI(question_id=question_id, answer_ai=answer_ai)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer
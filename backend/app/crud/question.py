# app/crud/question.py
from sqlalchemy.orm import Session
from app.models.question import NodeQuestion

def create_question(db: Session, node_id: int, question: str):
    q = NodeQuestion(node_id=node_id, question=question)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q
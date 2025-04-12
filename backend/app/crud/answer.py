from sqlalchemy.orm import Session
from app.models.answer import NodeAnswerAI, NodeAnswerUser
from uuid import UUID

def create_ai_answer(db: Session, question_id: UUID, answer_text: str) -> NodeAnswerAI:
    answer = NodeAnswerAI(question_id=question_id, answer_text=answer_text)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

def create_user_answer(db: Session, question_id: UUID, answer_text: str) -> NodeAnswerUser:
    answer = NodeAnswerUser(question_id=question_id, answer_text=answer_text)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

def get_ai_answer(db: Session, answer_id: UUID) -> NodeAnswerAI:
    return db.query(NodeAnswerAI).filter(NodeAnswerAI.id == answer_id).first()

def get_user_answer(db: Session, answer_id: UUID) -> NodeAnswerUser:
    return db.query(NodeAnswerUser).filter(NodeAnswerUser.id == answer_id).first() 
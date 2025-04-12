from sqlalchemy.orm import Session
from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionUpdate

def get_question(db: Session, question_id: int):
    return db.query(Question).filter(Question.id == question_id).first()

def get_questions_by_node(db: Session, node_id: int, skip: int = 0, limit: int = 100):
    return db.query(Question).filter(Question.node_id == node_id).offset(skip).limit(limit).all()

def create_question(db: Session, question: QuestionCreate):
    db_question = Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def update_question(db: Session, question_id: int, question: QuestionUpdate):
    db_question = get_question(db, question_id)
    if db_question:
        for key, value in question.dict(exclude_unset=True).items():
            setattr(db_question, key, value)
        db.commit()
        db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int):
    db_question = get_question(db, question_id)
    if db_question:
        db.delete(db_question)
        db.commit()
    return db_question 
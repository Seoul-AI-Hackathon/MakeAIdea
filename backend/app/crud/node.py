# backend/app/crud/node.py
from sqlalchemy.orm import Session
from app.models import Node, NodeQuestion, AiAnswer, UserAnswer
from uuid import UUID

def create_node_question(db: Session, project_id: UUID, parent_id: UUID | None, level: int, question_text: str) -> NodeQuestion:
    node = Node(project_id=project_id, parent_id=parent_id, level=level)
    db.add(node)
    db.flush()  # node.id 확보

    question = NodeQuestion(node_id=node.id, question_text=question_text)
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def create_ai_answer(db: Session, question_id: UUID, answer_text: str) -> AiAnswer:
    answer = AiAnswer(question_id=question_id, answer_text=answer_text)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

def create_user_answer(db: Session, question_id: UUID, answer_text: str) -> UserAnswer:
    answer = UserAnswer(question_id=question_id, answer_text=answer_text)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

def update_question_score(db: Session, question_id: UUID, score: int) -> NodeQuestion:
    question = db.query(NodeQuestion).filter(NodeQuestion.id == question_id).first()
    if question:
        question.score = score
        db.commit()
        db.refresh(question)
    return question

# backend/app/services/question_service.py
from uuid import UUID
from sqlalchemy.orm import Session

from app.llm.question_generator import generate_question_from_summary
from app.llm.answer_generator import generate_expected_answer
from app.crud.node import create_node_question, create_ai_answer

def create_and_save_question(db: Session, project_id: UUID, parent_node_id: UUID | None, level: int, summary: str):
    # 1. 질문 생성
    question = generate_question_from_summary(summary)

    # 2. 예상 답변 생성
    expected_answer = generate_expected_answer(question, context=summary)

    # 3. DB 저장
    question_obj = create_node_question(
        db=db,
        project_id=project_id,
        parent_id=parent_node_id,
        level=level,
        question_text=question
    )

    ai_answer = create_ai_answer(
        db=db,
        question_id=question_obj.id,
        answer_text=expected_answer
    )

    return {
        "node_id": question_obj.node_id,
        "question": question,
        "expected_answer": expected_answer
    }

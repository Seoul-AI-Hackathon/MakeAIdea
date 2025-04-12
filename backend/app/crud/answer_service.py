# backend/app/services/answer_service.py
from uuid import UUID
from sqlalchemy.orm import Session

from app.llm.evaluator import evaluate_user_answer
from app.crud.node import create_user_answer, update_question_score


def submit_user_answer(
    db: Session,
    question_id: UUID,
    user_answer: str,
    expected_answer: str,
    context: str
):
    # 1. 평가
    score_str = evaluate_user_answer(expected_answer, user_answer, context)
    try:
        score = int(score_str.strip().split()[0])  # 예: "85점" → 85
    except Exception:
        score = 0

    # 2. 유저 답변 저장
    user_answer_obj = create_user_answer(
        db=db,
        question_id=question_id,
        answer_text=user_answer
    )

    # 3. 점수 업데이트
    update_question_score(db=db, question_id=question_id, score=score)

    return {
        "user_answer": user_answer,
        "score": score
    }

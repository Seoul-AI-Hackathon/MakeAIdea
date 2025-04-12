# backend/app/api/answers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.answer import UserAnswerIn, ScoreOut
from app.core.db import get_db
from app.crud.answer import create_user_answer, get_ai_answer_by_question_id
from app.crud.question import get_question_by_id, update_question_score
from app.crud.node import get_node_by_question_id, create_node
from app.services.answer_evaluator import evaluate_answer
from app.services.question_generator import generate_question_and_answer, extract_keyword
from app.crud.question import create_question
from app.crud.answer import create_ai_answer
from app.crud.project import get_project_by_id

router = APIRouter()

@router.post("/questions/{question_id}/answer/user", response_model=ScoreOut)
def submit_user_answer(question_id: int, payload: UserAnswerIn, db: Session = Depends(get_db)):
    create_user_answer(db, question_id, payload.answer_user)
    ai_answer = get_ai_answer_by_question_id(db, question_id)
    question_obj = get_question_by_id(db, question_id)
    score, feedback = evaluate_answer(
        question=question_obj.question,
        user_answer=payload.answer_user,
        ai_answer=ai_answer.answer_ai
    )
    update_question_score(db, question_id, score)

    node = get_node_by_question_id(db, question_id)
    if node.level < 3:
        selected_answer = payload.answer_user if score >= 7 else ai_answer.answer_ai
        context = get_project_by_id(db, node.project_id).description
        new_q, new_ai = generate_question_and_answer(context + "\n" + question_obj.question + "\n" + selected_answer)
        new_node = create_node(db, project_id=node.project_id, parent_id=node.id, level=node.level+1, keyword=extract_keyword(new_q))
        q_obj = create_question(db, node_id=new_node.id, question=new_q)
        create_ai_answer(db, question_id=q_obj.id, answer_ai=new_ai)

    return {"score": score, "feedback": feedback}

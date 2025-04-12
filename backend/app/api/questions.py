# backend/app/api/questions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.question import QuestionCreate, QuestionOut
from app.crud.question import create_question
from app.core.db import get_db

router = APIRouter()

@router.post("/nodes/{node_id}/questions", response_model=QuestionOut)
def create_node_question(node_id: int, payload: QuestionCreate, db: Session = Depends(get_db)):
    return create_question(db, node_id=node_id, question=payload.question)

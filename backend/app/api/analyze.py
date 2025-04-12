# app/api/analyze.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.analyze import AnalyzeRequest
from app.utils.youtube import extract_mp3_from_youtube
from app.utils.whisper import transcribe_audio_to_text
from app.services.summarizer import summarize_text
from app.services.question_service import create_and_save_question
from app.crud.project import create_project

router = APIRouter()

@router.post("/analyze/video")
def analyze_video(data: AnalyzeRequest, db: Session = Depends(get_db)):
    mp3_path, title = extract_mp3_from_youtube(data.url)
    transcript = transcribe_audio_to_text(mp3_path)
    summary = summarize_text(transcript)

    # title 정제: UUID이면 summary 일부로 대체
    import re
    if not title or re.fullmatch(r"[0-9a-f\-]{36}", title):
        title = " ".join(summary.split()[:5]) + "..."

    # 프로젝트 생성
    project = create_project(db, title=title, description=summary)

    # 루트 노드에 첫 질문 생성
    create_and_save_question(
        db=db,
        project_id=project.id,
        parent_node_id=None,
        level=0,
        summary=summary
    )

    return {"project_id": project.id, "title": project.title}
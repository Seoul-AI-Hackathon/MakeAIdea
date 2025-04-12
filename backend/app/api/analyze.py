# backend/app/api/analyze.py
from fastapi import APIRouter, Depends
from app.schemas.analyze import AnalyzeResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.crud.project import create_project
from app.services.summarizer import summarize_text
from app.utils.youtube import extract_mp3_from_youtube
from app.utils.whisper import transcribe_audio_to_text

router = APIRouter()

@router.post("/analyze/video", response_model=AnalyzeResponse)
def analyze_video(youtube_url: str, db: Session = Depends(get_db)):
    # 🎥 유튜브에서 mp3 추출 및 제목 획득
    mp3_path, title = extract_mp3_from_youtube(youtube_url)

    # 🔊 Whisper STT 수행
    transcript = transcribe_audio_to_text(mp3_path)

    # 🧠 요약 생성
    summary = summarize_text(transcript)

    # 💾 DB에 프로젝트 저장
    project = create_project(db, title=title, description=summary)

    return AnalyzeResponse(
        project_id=str(project.id),
        title=project.title,
        summary=project.description
    )
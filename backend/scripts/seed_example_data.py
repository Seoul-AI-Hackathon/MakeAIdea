# scripts/seed_example_data.py
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.crud.project import create_project
from app.utils.youtube import extract_mp3_from_youtube
from app.utils.whisper import transcribe_audio_to_text
from app.services.summarizer import summarize_text

# 👉 이 코드를 실제 프론트엔드 입력값으로 연결하려면 아래와 같이 작성할 수 있습니다:
# def run_with_url(youtube_url: str):
#     db: Session = SessionLocal()
#     mp3_path, title = extract_mp3_from_youtube(youtube_url)
#     transcript = transcribe_audio_to_text(mp3_path)
#     summary = summarize_text(transcript)
#     return create_project(db, title=title, description=summary)

YOUTUBE_URL = "https://www.youtube.com/watch?v=sAzL4XMke80"

def run():
    db: Session = SessionLocal()

    print("🎥 Downloading audio from YouTube...")
    mp3_path, title = extract_mp3_from_youtube(YOUTUBE_URL)

    print("🔊 Transcribing audio with Whisper...")
    transcript = transcribe_audio_to_text(mp3_path)

    print("🧠 Summarizing transcript with LLM...")
    summary = summarize_text(transcript)

    # title이 없거나 UUID 형식이면 summary 앞 5단어로 대체
    import re
    if not title or re.fullmatch(r"[0-9a-f\-]{36}", title):
        title = " ".join(summary.split()[:5]) + "..."

    print("💾 Saving project to database...")
    project = create_project(db, title=title, description=summary)

    print(f"✅ Done. Project ID: {project.id}")


if __name__ == "__main__":
    run()

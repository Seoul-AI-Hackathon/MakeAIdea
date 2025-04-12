# backend/app/utils/whisper.py
import subprocess

def transcribe_audio_to_text(mp3_path: str) -> str:
    # 🤖 실제 Whisper API 또는 로컬 whisper.cpp 등으로 대체 가능
    # 여기선 더미로 ffmpeg + 리턴 문자열 가정
    if not mp3_path.endswith(".mp3"):
        raise ValueError("Only .mp3 files are supported")

    # DUMMY 방식: 텍스트 파일로 리턴 (실제 Whisper 연동 가능)
    return "This video discusses convolution layers, feature maps, and pooling in CNNs."

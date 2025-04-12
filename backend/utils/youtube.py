# backend/app/utils/youtube.py
import os
import subprocess
import uuid

def extract_mp3_from_youtube(youtube_url: str, output_dir="temp_audio") -> tuple[str, str]:
    os.makedirs(output_dir, exist_ok=True)
    filename_base = str(uuid.uuid4())
    output_path = os.path.join(output_dir, filename_base + ".mp3")

    command = [
        "yt-dlp",
        "-x", "--audio-format", "mp3",
        "--audio-quality", "192K",
        "-o", os.path.join(output_dir, filename_base + ".%(ext)s"),
        youtube_url
    ]
    subprocess.run(command, capture_output=True, text=True)
    
    return output_path, filename_base  # title 대신 uuid로 식별
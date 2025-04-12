# app/core/config.py
from pydantic_settings import BaseSettings  # ✅ 변경된 위치!

class Settings(BaseSettings):
    DATABASE_URL: str
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
from pydantic import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str = "your-openai-api-key"
    DATABASE_URL: str = "postgresql://user:password@localhost/makeaidea"

    class Config:
        env_file = ".env"

settings = Settings()

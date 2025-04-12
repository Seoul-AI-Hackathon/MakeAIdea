# scripts/reset_db.py
from app.core.db import engine
from app.models import project, node, question, answer
from app.core.db import Base
# app/schemas/analyze.py
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    url: str
    
print("🔥 Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("📁 Recreating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")

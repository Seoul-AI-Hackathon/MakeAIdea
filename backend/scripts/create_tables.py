# scripts/create_tables.py
from app.core.db import engine
from app.models import project, node, question, answer
from app.core.db import Base

print("📦 Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")
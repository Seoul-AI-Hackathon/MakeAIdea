# scripts/reset_db.py
from app.core.db import engine, Base

print("🔥 Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("🧱 Recreating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")


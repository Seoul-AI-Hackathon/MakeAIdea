# MCP Server (Python FastAPI with PostgreSQL)
from fastapi import FastAPI, UploadFile, Form, File, Body
from fastapi.responses import JSONResponse
from typing import List, Optional
import uuid
import httpx
import psycopg2
import os

app = FastAPI()

# PostgreSQL 연결 설정
DB_URL = os.getenv("DATABASE_URL", "dbname=mcp_db user=postgres password=postgres host=localhost port=5432")
conn = psycopg2.connect(DB_URL)
cursor = conn.cursor()

# 초기 테이블 생성 (파일, 로그)
cursor.execute("""
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    filename TEXT,
    filetype TEXT,
    content TEXT
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    event TEXT,
    payload JSONB
);
""")
conn.commit()

AGENTIC_RAG_API = "http://localhost:8001"  # FastAPI agentic rag server

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), type: str = Form(...)):
    content = await file.read()
    file_id = str(uuid.uuid4())
    text = content.decode("utf-8")

    cursor.execute(
        "INSERT INTO files (id, filename, filetype, content) VALUES (%s, %s, %s, %s)",
        (file_id, file.filename, type, text)
    )
    conn.commit()

    return {"status": "success", "fileId": file_id, "textPreview": text[:200]}

@app.post("/generate-questions")
async def generate_questions(topic: str = Body(...), fileId: str = Body(...)):
    cursor.execute("SELECT content FROM files WHERE id = %s", (fileId,))
    result = cursor.fetchone()
    context = result[0] if result else ""

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AGENTIC_RAG_API}/generate", json={"topic": topic, "context": context})
    return response.json()

@app.post("/evaluate")
async def evaluate_answer(
    question: str = Body(...),
    userAnswer: str = Body(...),
    aiAnswer: str = Body(...)
):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AGENTIC_RAG_API}/evaluate", json={
            "question": question,
            "userAnswer": userAnswer,
            "aiAnswer": aiAnswer
        })
    return response.json()

@app.post("/followup")
async def followup(userAnswer: str = Body(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AGENTIC_RAG_API}/followup", json={"userAnswer": userAnswer})
    return response.json()

@app.post("/log")
async def log_event(userId: str = Body(...), event: str = Body(...), payload: dict = Body(...)):
    log_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO logs (id, user_id, event, payload) VALUES (%s, %s, %s, %s)",
        (log_id, userId, event, json.dumps(payload))
    )
    conn.commit()
    return {"status": "ok"}

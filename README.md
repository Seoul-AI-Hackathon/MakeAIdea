
# 📚 VOD 기반 AI 학습 보조 시스템

이 프로젝트는 **VOD 강의 영상**을 입력으로 받아 **내용을 요약하고**, 사용자에게 **질문-응답 기반 학습을 제공**하는 시스템입니다.  
OpenAI 기반 LLM과 Agentic RAG, PostgreSQL을 활용하여, 짧은 시간 안에 효과적인 학습을 가능하게 합니다.

---

## 🧩 주요 구성 요소

| 구성 요소      | 설명 |
|----------------|------|
| **Frontend (Next.js)** | 사용자 인터페이스, 파일 업로드, 질문/답변 UI |
| **MCP Server (FastAPI)** | 파일 처리, DB 저장, RAG 서버와 통신 |
| **RAG Agent (FastAPI)** | Agentic 방식으로 질문 생성, 답변 평가, 꼬리질문 생성 |
| **PostgreSQL** | 프롬프트 로그, 유저 입력, 텍스트 등 저장소 |
| **OpenAI API** | LLM 기반 응답 생성 (질문, 답변, 피드백 등) |

---

## 🏗️ 아키텍처 구성도

```
[User]
  ⇅
[Frontend (Next.js)]
  ⇅
[MCP Server - FastAPI]
  ⇅
[RAG Agent Server - FastAPI]
  ⇅
[OpenAI API]
  ⇅
[PostgreSQL]
```

---

## 🗂️ 디렉토리 구조

```
seoulAI/
├── frontend/                  # Next.js 프론트엔드
│   └── Dockerfile
│   └── .dockerignore
│
├── backend_mcp_server/        # 파일 처리 및 메인 API 서버
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── backend_rag_agent/         # Agentic 질문 생성/평가 API
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml         # 전체 서비스 오케스트레이션
└── pgdata/                    # PostgreSQL 볼륨
```

---

## 🚀 실행 방법

### 1. Docker 환경에서 실행

```bash
cd docker
docker-compose up --build
```

### 2. 서비스 접속

| 서비스 | 주소 |
|--------|------|
| Frontend | http://localhost:3000 |
| MCP Server API | http://localhost:5000 |
| RAG Agent API | http://localhost:8001 |
| PostgreSQL | localhost:5432 (user/pass: postgres / postgres) |

---

## 🔧 환경 변수 예시 (.env)

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/mcp_db
OPENAI_API_KEY=sk-...
```

`.env`는 MCP와 RAG 서버에서 Python `python-dotenv`로 불러올 수 있습니다.

---

## ✅ 각 시스템 수동 실행 (옵션)

### MCP Server
```bash
cd backend_mcp_server
uvicorn main:app --host 0.0.0.0 --port 5000
```

### RAG Agent Server
```bash
cd backend_rag_agent
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

## 🧠 Agentic RAG 흐름 요약

1. 사용자가 주제 선택
2. RAG Agent가 관련 context 검색 (retriever)
3. 질문 생성 → 응답 → 평가 → 꼬리질문 생성
4. 모든 흐름은 OpenAI LLM 기반

---

## 🙌 향후 계획

- 사용자 학습 분석 대시보드
- LangChain 기반 Agent 확장
- S3 / Firebase 연동을 통한 대용량 영상 저장

---

> 해커톤 프로젝트 기준으로 간결하고 핵심 기능 중심으로 구성되었습니다.

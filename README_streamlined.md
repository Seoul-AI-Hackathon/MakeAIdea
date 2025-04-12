
# 🎓 makeAidea - VOD 기반 AI 학습 시스템

이 프로젝트는 **VOD 강의 영상 또는 자료**를 기반으로 사용자가 능동적으로 학습할 수 있도록 돕는 **AI 질문 생성/응답 플랫폼**입니다.  
OpenAI LLM과 FastAPI 기반의 Agentic RAG 구조를 활용하여, 강의 핵심 내용 요약과 심화 질문-답변 학습 흐름을 제공합니다.

---

## 🧱 프로젝트 구성

| 컴포넌트 | 설명 |
|----------|------|
| **Frontend (Next.js)** | 사용자 인터페이스, 업로드 및 질문 응답 UI |
| **RAG Agent Server (FastAPI)** | 질문 생성 / 답변 평가 / 꼬리 질문 생성 담당 |
| **PostgreSQL** | 질문/응답/로그 저장소 |
| **OpenAI API** | LLM 호출을 통한 자연어 생성 처리 |

---

## 🏗️ 아키텍처

```
[User]
  ⇅
[Frontend (Next.js)]
  ⇅
[RAG Agent API (FastAPI)]
    ├─ 질문 생성 (/generate)
    ├─ 응답 평가 (/evaluate)
    ├─ 꼬리질문 (/followup)
    └─ PostgreSQL 연동
  ⇅
[OpenAI API]
```

---

## 🗂️ 디렉토리 구조

```
streamlined_project/
├── frontend/                # 사용자 인터페이스 (Next.js)
│   ├── Dockerfile
│   └── .dockerignore
│
├── rag_agent/              # 핵심 기능 API 서버 (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
│
├── docker-compose.yml      # 전체 서비스 오케스트레이션
└── pgdata/                 # PostgreSQL 데이터 볼륨 (Docker)
```

---

## 🚀 실행 방법

### 1. 프로젝트 빌드 및 실행

```bash
cd streamlined_project
docker-compose up --build
```

### 2. 서비스 접속

| 서비스 | 주소 |
|--------|------|
| Frontend | http://localhost:3000 |
| RAG Agent API | http://localhost:8001 |
| PostgreSQL | localhost:5432 (postgres / postgres) |

---

## 🔧 환경 변수 예시 (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/mcp_db
OPENAI_API_KEY=your-openai-api-key
```

---

## ✅ 주요 기능

- 🎯 주제 기반 질문 자동 생성 (`/generate`)
- ✍️ 사용자의 응답과 AI 정답 비교 (`/evaluate`)
- 🔁 follow-up 꼬리질문 생성 (`/followup`)
- 🧠 OpenAI LLM API 기반 자연어 처리

---

## 📦 배포 준비

- 모든 서비스에 `Dockerfile` 및 `.dockerignore` 포함
- PostgreSQL 포함한 `docker-compose.yml` 구성 완료
- `requirements.txt`로 의존성 명확화

---

## 🧪 향후 개발 예정

- [ ] 텍스트 추출기능 (PDF/자막)
- [ ] 세션 기반 사용자 질문 흐름 추적
- [ ] 학습 이력 시각화 대시보드

---

> 이 프로젝트는 빠른 개발을 위한 해커톤/연구 목적으로 설계되었습니다.

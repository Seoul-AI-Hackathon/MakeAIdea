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

### Frontend (Next.js) 개발 서버 실행

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### RAG Agent Server (FastAPI) 실행

```bash
cd rag_agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 전체 서비스 실행 (Docker)

```bash
docker-compose up --build
```

---

## 📚 기술 스택

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **AI**: OpenAI API
- **Deployment**: Docker, Docker Compose

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

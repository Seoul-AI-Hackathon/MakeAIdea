# 🧠 makeAidea Backend

LLM 기반 비디오 분석 및 학습 시스템 백엔드입니다.

## 🚀 구성 요소
- FastAPI 기반 REST API
- PostgreSQL + SQLAlchemy
- Whisper + OpenAI 기반 요약 및 질의 생성
- 프로젝트/노드/질문/답변 기반 트리 구조 저장

## 📦 실행 방법
```bash
# 1. .env 파일 설정
cp .env.example .env

# 2. PostgreSQL 실행
docker compose up -d

# 3. 가상환경에서 의존성 설치
pip install -r requirements.txt

# 4. 테이블 생성
python scripts/create_tables.py

# 5. 샘플 영상 데이터 분석 및 저장
python scripts/seed_example_data.py

# 6. 트리 자동 생성 (레벨 3까지)
python scripts/generate_full_tree.py

# 7. 서버 실행
uvicorn app.main:app --reload
```

## 📁 디렉토리 구조
```
backend/
├── app/
│   ├── api/              # API 라우터
│   ├── core/             # DB, 환경 설정
│   ├── crud/             # DB 연산 함수
│   ├── models/           # SQLAlchemy 모델
│   ├── schemas/          # Pydantic 요청/응답 정의
│   ├── services/         # 요약, 질문 생성, 평가
│   ├── utils/            # Whisper, yt-dlp 등 유틸
│   └── main.py           # FastAPI 진입점
├── scripts/              # 초기화/테스트 스크립트
├── docker-compose.yml
├── requirements.txt
└── .env
```

## 📌 주요 기능 흐름
1. 유튜브 링크 → Whisper 변환
2. LLM 요약 → 프로젝트 저장
3. 질문/답변 생성 → 트리 확장
4. 유저 답변 입력 → 평가 및 점수 저장

---

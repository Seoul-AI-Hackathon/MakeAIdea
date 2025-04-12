
# 📘 VOD 학습 플랫폼 API 명세서

## 📂 1. 파일 업로드
- **URL**: `POST /api/upload`
- **설명**: PDF / 영상 / URL 업로드
- **Body (form-data)**:
  - `file` (binary)
  - `type` (string): `pdf` | `video` | `url`
- **Response**:
```json
{
  "status": "success",
  "fileId": "abc123",
  "textPreview": "텍스트 일부..."
}
```

---

## 📂 2. 텍스트 인덱싱
- **URL**: `POST /api/index`
- **설명**: 텍스트 벡터화 및 저장
- **Body (JSON)**:
```json
{
  "fileId": "abc123",
  "text": "강의 텍스트 전체"
}
```

---

## 📂 3. 주제 추출
- **URL**: `GET /api/topics?fileId=abc123`
- **설명**: 대주제/소주제 자동 추출
- **Response**:
```json
{
  "mainTopics": ["AI 윤리", "지도학습"],
  "subTopics": {
    "AI 윤리": ["편향", "투명성"]
  }
}
```

---

## 📂 4. 질문 생성
- **URL**: `POST /api/generate-questions`
- **Body (JSON)**:
```json
{
  "topic": "AI 윤리"
}
```
- **Response**:
```json
{
  "questions": ["AI 윤리란?", "편향을 어떻게 해결?"]
}
```

---

## 📂 5. 유사도 평가
- **URL**: `POST /api/evaluate`
- **Body (JSON)**:
```json
{
  "question": "AI 윤리란?",
  "userAnswer": "공정성과 투명성",
  "aiAnswer": "공정성, 투명성, 책임감"
}
```
- **Response**:
```json
{
  "similarity": 0.78,
  "isPass": true,
  "feedback": "책임감도 포함되면 더 완벽합니다."
}
```

---

## 📂 6. 꼬리질문 생성
- **URL**: `POST /api/followup`
- **Body (JSON)**:
```json
{
  "userAnswer": "공정성과 투명성"
}
```
- **Response**:
```json
{
  "followUpQuestion": "공정성을 어떻게 구현하나요?"
}
```

---

## 📂 7. 로그 저장
- **URL**: `POST /api/log`
- **설명**: 사용자 프롬프트 저장
- **Body (JSON)**:
```json
{
  "userId": "temp_01",
  "event": "question_generated",
  "payload": {
    "topic": "AI 윤리",
    "question": "AI 윤리란?"
  }
}
```

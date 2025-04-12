```yaml

openapi: 3.0.0
info:
  title: VOD 학습 플랫폼 API
  version: 1.0.0
  description: AI 기반 VOD 요약 및 질문/답변 시스템을 위한 API 명세

servers:
  - url: https://yourdomain.com/api

paths:
  /upload:
    post:
      summary: 파일 업로드
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                type:
                  type: string
                  enum: [pdf, video, url]
      responses:
        '200':
          description: 업로드 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  fileId:
                    type: string
                  textPreview:
                    type: string

  /index:
    post:
      summary: 텍스트 인덱싱
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                fileId:
                  type: string
                text:
                  type: string
      responses:
        '200':
          description: 인덱싱 성공

  /topics:
    get:
      summary: 대주제 및 소주제 추출
      parameters:
        - in: query
          name: fileId
          schema:
            type: string
          required: true
      responses:
        '200':
          description: 주제 리스트 반환
          content:
            application/json:
              schema:
                type: object
                properties:
                  mainTopics:
                    type: array
                    items:
                      type: string
                  subTopics:
                    type: object
                    additionalProperties:
                      type: array
                      items:
                        type: string

  /generate-questions:
    post:
      summary: 주제 기반 질문 생성
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                topic:
                  type: string
      responses:
        '200':
          description: 질문 생성 완료
          content:
            application/json:
              schema:
                type: object
                properties:
                  questions:
                    type: array
                    items:
                      type: string

  /evaluate:
    post:
      summary: 답변 유사도 평가
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                question:
                  type: string
                userAnswer:
                  type: string
                aiAnswer:
                  type: string
      responses:
        '200':
          description: 유사도 평가 결과
          content:
            application/json:
              schema:
                type: object
                properties:
                  similarity:
                    type: number
                  isPass:
                    type: boolean
                  feedback:
                    type: string

  /followup:
    post:
      summary: 꼬리질문 생성
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userAnswer:
                  type: string
      responses:
        '200':
          description: 꼬리질문 생성 완료
          content:
            application/json:
              schema:
                type: object
                properties:
                  followUpQuestion:
                    type: string

  /log:
    post:
      summary: 프롬프트/로그 저장
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                event:
                  type: string
                payload:
                  type: object
      responses:
        '200':
          description: 저장 완료

```
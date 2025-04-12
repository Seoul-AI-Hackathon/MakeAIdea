# backend/app/services/question_generator.py
from app.llm.question_generator import generate_question_from_summary
from app.llm.answer_generator import generate_expected_answer


def extract_keywords_from_question(question: str) -> list[str]:
    # 간단한 키워드 추출 (예: 명사 필터링 or 공백 기준 분할)
    return [word.strip("?.,") for word in question.split() if len(word) > 3]


def generate_question(summary: str) -> tuple[str, str, list[str]]:
    question = generate_question_from_summary(summary)
    expected = generate_expected_answer(question, context=summary)
    keywords = extract_keywords_from_question(question)
    return question, expected, keywords
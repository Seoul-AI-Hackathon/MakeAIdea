def generate_question_and_answer(summary: str) -> tuple[str, str]:
    # 🤖 DUMMY: 실제로는 GPT 등을 사용해 질문과 AI 답변 생성
    question = "What is a convolution layer?"
    answer = "A convolution layer is used to extract features from images using filters."
    return question, answer

def extract_keyword(question: str) -> str:
    # DUMMY: 질문에서 키워드를 추출하는 함수
    return "convolution layer"
def evaluate_answer(question: str, user_answer: str, ai_answer: str) -> tuple[int, str]:
    # 🤖 DUMMY: 실제로는 GPT를 사용해 점수와 피드백 생성
    if user_answer.lower() in ai_answer.lower():
        return 8, "Great! Your answer matches the expected response."
    else:
        return 4, "Your answer is partially correct. Try to include key concepts."
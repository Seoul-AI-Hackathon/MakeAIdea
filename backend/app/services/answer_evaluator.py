from app.llm.evaluator import evaluate_user_answer

def evaluate_answer(expected: str, user: str, context: str) -> int:
    score = evaluate_user_answer(expected, user, context)
    try:
        return int(score.strip().split()[0])  # "85점" → 85
    except Exception:
        return 0
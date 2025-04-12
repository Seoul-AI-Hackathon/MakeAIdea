from app.llm.summarizer import generate_summary

def summarize_text(text: str) -> str:
    return generate_summary(text)
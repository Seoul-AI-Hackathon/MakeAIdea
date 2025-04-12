from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser
from app.core.config import settings

llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    openai_api_key=settings.OPENAI_API_KEY
)
output_parser = StrOutputParser()

def generate_question_from_summary(summary_text: str) -> str:
    prompt = PromptTemplate.from_template("다음 내용을 바탕으로 사용자가 답변할 수 있는 질문을 생성하세요:\n\n{summary}")
    chain = prompt | llm | output_parser
    return chain.invoke({"summary": summary_text})

def generate_question_and_answer(summary_text: str) -> tuple[str, str]:
    question_prompt = PromptTemplate.from_template("다음 내용을 바탕으로 사용자가 답변할 수 있는 질문을 생성하세요:\n\n{summary}")
    answer_prompt = PromptTemplate.from_template("다음 질문에 대한 정답을 생성하세요:\n\n질문: {question}\n내용: {summary}")
    
    question_chain = question_prompt | llm | output_parser
    answer_chain = answer_prompt | llm | output_parser
    
    question = question_chain.invoke({"summary": summary_text})
    answer = answer_chain.invoke({"question": question, "summary": summary_text})
    
    return question, answer
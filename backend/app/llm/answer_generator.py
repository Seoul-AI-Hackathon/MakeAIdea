from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser
from app.core.config import settings

llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.5,
    openai_api_key=settings.OPENAI_API_KEY
)
output_parser = StrOutputParser()

def generate_expected_answer(question: str, context: str) -> str:
    prompt = PromptTemplate.from_template("다음 질문과 문맥을 참고하여 AI의 예상 답변을 생성하세요:\n\n질문: {question}\n\n문맥: {context}")
    chain = prompt | llm | output_parser
    return chain.invoke({"question": question, "context": context})

def generate_ai_answer(question: str, context: str) -> str:
    prompt = PromptTemplate.from_template("다음 질문과 문맥을 참고하여 AI의 답변을 생성하세요:\n\n질문: {question}\n\n문맥: {context}")
    chain = prompt | llm | output_parser
    return chain.invoke({"question": question, "context": context})
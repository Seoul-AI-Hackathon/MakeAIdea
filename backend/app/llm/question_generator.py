from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4", temperature=0.7)
output_parser = StrOutputParser()

def generate_question_from_summary(summary_text: str) -> str:
    prompt = PromptTemplate.from_template("다음 내용을 바탕으로 사용자가 답변할 수 있는 질문을 생성하세요:\n\n{summary}")
    chain = prompt | llm | output_parser
    return chain.invoke({"summary": summary_text})
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4", temperature=0.3)
output_parser = StrOutputParser()

def evaluate_user_answer(expected: str, user_answer: str, context: str) -> str:
    prompt = PromptTemplate.from_template("""
        아래는 문맥, 예상 답변, 유저의 답변입니다. 유사도를 0~100 점수로 매겨 주세요.\n\n
        문맥:\n{context}\n\n예상 답변:\n{expected}\n\n유저 답변:\n{user}\n\n점수:
    """)
    chain = prompt | llm | output_parser
    return chain.invoke({"expected": expected, "user": user_answer, "context": context})
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4", temperature=0.5)
output_parser = StrOutputParser()

def generate_summary(raw_text: str) -> str:
    prompt = PromptTemplate.from_template("다음 텍스트를 간결하게 요약해 주세요:\n\n{input_text}")
    summary_chain = prompt | llm | output_parser
    return summary_chain.invoke({"input_text": raw_text})
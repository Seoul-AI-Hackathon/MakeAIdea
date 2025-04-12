import os
import pickle
import faiss
from langchain.vectorstores.faiss import FAISS
from langchain_openai import OpenAIEmbeddings

embedding_model = OpenAIEmbeddings()

FAISS_INDEX_PATH = "data/faiss_index"
DOCSTORE_PATH = "data/docstore.pkl"

def load_faiss_index():
    index = faiss.read_index(f"{FAISS_INDEX_PATH}/index.faiss")
    with open(DOCSTORE_PATH, "rb") as f:
        docstore = pickle.load(f)
    return FAISS(index=index, docstore=docstore, index_to_docstore_id={})

def get_similar_docs(query: str, k: int = 3):
    vectorstore = load_faiss_index()
    return vectorstore.similarity_search(query, k=k)
from fastapi import FastAPI
from app.api import analyze
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(analyze.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"msg": "makeAidea backend is running"}

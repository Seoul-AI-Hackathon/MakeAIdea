from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.core.db import Base

class NodeAnswerAI(Base):
    __tablename__ = 'node_answer_ai'
    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('node_question.id'))
    answer_ai = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class NodeAnswerUser(Base):
    __tablename__ = 'node_answer_user'
    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('node_question.id'))
    answer_user = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.core.db import Base

class Question(Base):
    __tablename__ = 'node_question'
    id = Column(Integer, primary_key=True)
    node_id = Column(Integer, ForeignKey('node.id'))
    question = Column(Text)
    score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

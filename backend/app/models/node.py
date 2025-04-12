from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.core.db import Base

class Node(Base):
    __tablename__ = 'node'
    id = Column(Integer, primary_key=True)
    project_id = Column(ForeignKey('projects.id'))
    parent_id = Column(Integer, ForeignKey('node.id'), nullable=True)
    level = Column(Integer)
    keyword = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

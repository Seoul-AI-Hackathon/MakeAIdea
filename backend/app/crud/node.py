# app/crud/node.py
from sqlalchemy.orm import Session
from app.models.node import Node

def create_node(db: Session, project_id: str, parent_id: int | None, level: int, keyword: str):
    node = Node(
        project_id=project_id,
        parent_id=parent_id,
        level=level,
        keyword=keyword
    )
    db.add(node)
    db.commit()
    db.refresh(node)
    return node
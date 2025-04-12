from app.models.project import Project
from sqlalchemy.orm import Session
from uuid import uuid4

def create_project(db: Session, title: str, description: str) -> Project:
    project = Project(id=uuid4(), title=title, description=description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def get_project_by_id(db: Session, project_id: str) -> Project:
    return db.query(Project).filter(Project.id == project_id).first()

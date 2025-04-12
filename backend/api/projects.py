# backend/app/api/projects.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.crud.project import get_project_by_id, get_all_projects
from app.schemas.analyze import AnalyzeResponse
from typing import List

router = APIRouter()

@router.get("/projects", response_model=List[AnalyzeResponse])
def list_projects(db: Session = Depends(get_db)):
    """
    전체 프로젝트 리스트 조회
    - 최근 학습한 영상 요약들을 불러올 때 사용
    """
    return get_all_projects(db)


@router.get("/projects/{project_id}", response_model=AnalyzeResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """
    특정 프로젝트 상세 조회 (요약 포함)
    """
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
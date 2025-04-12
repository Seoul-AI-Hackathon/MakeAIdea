# scripts/generate_full_tree.py
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.crud.project import create_project, get_all_projects
from app.crud.node import create_node
from app.crud.question import create_question
from app.crud.answer import create_ai_answer
from app.services.question_generator import generate_question_and_answer, extract_keyword


def expand_node(db: Session, project_id: str, parent_id: int, level: int):
    if level >= 3:
        return
    question, ai_answer = generate_question_and_answer("dummy context")
    keyword = extract_keyword(question)
    new_node = create_node(db, project_id=project_id, parent_id=parent_id, level=level, keyword=keyword)
    q_obj = create_question(db, node_id=new_node.id, question=question)
    create_ai_answer(db, question_id=q_obj.id, answer_ai=ai_answer)
    expand_node(db, project_id, new_node.id, level + 1)


def run():
    db: Session = SessionLocal()
    projects = get_all_projects(db)
    if not projects:
        print("❌ No projects found. Run seed_example_data.py first.")
        return

    for project in projects:
        print(f"🌱 Expanding project {project.title} ({project.id})")
        # 루트 노드 생성
        root_node = create_node(db, project_id=project.id, parent_id=None, level=0, keyword="root")
        q = create_question(db, root_node.id, "What is the core idea?")
        create_ai_answer(db, q.id, "The core idea is to recursively test the knowledge.")
        expand_node(db, project.id, root_node.id, level=1)
        print("✅ Tree generated.")


if __name__ == "__main__":
    run()

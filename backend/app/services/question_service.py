from sqlalchemy.orm import Session
from app.models.node import Node
from app.crud import node as node_crud, question as question_crud, answer as answer_crud
from app.llm.question_generator import generate_question_and_answer
from app.llm.answer_generator import generate_ai_answer
from app.schemas.question import QuestionCreate, AnswerCreate


def create_child_question_flow(db: Session, parent_node: Node, video_text: str):
    """
    특정 노드의 자식 질문 생성 및 저장 흐름 처리.
    """
    # 1. 제한 조건: 노드 레벨이 3 이상이면 중단
    if parent_node.level >= 3:
        return None

    # 2. context 생성: 이전 질문과 답변을 기반으로 새로운 질문 생성
    history = node_crud.get_node_context(db, parent_node.id)  # [(q, a), ...]
    new_question_text, ai_answer_text = generate_question_and_answer(
        video_text=video_text,
        history=history
    )

    # 3. 새로운 노드 생성
    new_node = node_crud.create_node(
        db=db,
        parent_id=parent_node.id,
        project_id=parent_node.project_id,
        level=parent_node.level + 1,
        keyword=new_question_text  # 일단 질문 자체를 keyword로
    )

    # 4. 질문 저장
    question = question_crud.create_question(
        db=db,
        node_id=new_node.id,
        content=new_question_text
    )

    # 5. AI 예상 답변 저장
    answer = answer_crud.create_answer(
        db=db,
        node_id=new_node.id,
        question_id=question.id,
        content=ai_answer_text,
        is_user=False  # AI 답변
    )

    return new_node.id  # 또는 질문 ID
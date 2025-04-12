'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// ForceGraph2D를 클라이언트 사이드에서만 로드 (SSR 비활성화)
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
})

// 데이터베이스 타입 정의
interface DBNode {
  id: number
  project_id: string
  created_at: string
  parent_id: number | null
  keyword: string
  node_question: {
    id: number
    question: string
    Score: number
    created_at: string
    node_answer_user: {
      id: number
      answer_user: string
      created_at: string
    }[]
    node_answer_ai: {
      id: number
      answer_ai: string
      created_at: string
    }[]
  }[]
}

// 노드 데이터 타입 정의
interface Node {
  id: string
  name: string
  val: number
  color: string
  description?: string
  score?: number
  userAnswer?: string
  aiAnswer?: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
}

// 노드 간 연결선 타입 정의
interface Link {
  source: string
  target: string
  color: string
}

// 전체 그래프 데이터 타입 정의
interface GraphData {
  nodes: Node[]
  links: Link[]
}

interface MindMapProps {
  nodes?: DBNode[]
}

// 노드 정보 패널 컴포넌트
interface NodePanelProps {
  node: Node | null;
  onClose: () => void;
  position?: { x: number; y: number };
  fgRef?: React.RefObject<any>;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const NodePanel = ({ node, onClose, position, fgRef, setGraphData }: NodePanelProps) => {
  const [answer, setAnswer] = useState('');
  const [showAIAnswer, setShowAIAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const defaultQuestion = "What insights can you share about this topic?";
  const nodeQuestion = node?.description || defaultQuestion;

  const saveAnswer = async (nodeId: string, answer: string) => {
    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId,
          answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save answer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  };

  useEffect(() => {
    setAnswer(node?.userAnswer || '');
    setShowAIAnswer(false);
    setIsEditing(false);
  }, [node]);

  const handleClose = () => {
    setAnswer('');
    setShowAIAnswer(false);
    setIsEditing(false);
    onClose();
  };

  if (!node) return null;

  const hasUserAnswer = node.userAnswer && node.userAnswer.trim().length > 0;
  
  return (
    <motion.div 
      className="fixed bg-white shadow-lg z-50 rounded-lg w-[420px] right-6 top-1/2 -translate-y-1/2 overflow-hidden"
      initial={{ opacity: 0, x: 420 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 420 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-4 px-5 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{node.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X size={20}/>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600 font-medium">Selected topic: {node.name}</p>
            {node.score !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Score:</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                  {node.score}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <div className="w-full px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-sm">
                {nodeQuestion}
              </div>
            </div>

            {hasUserAnswer && !isEditing ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your Answer
                    </label>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit answer
                    </button>
                  </div>
                  <div className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 text-sm">
                    {node.userAnswer}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Answer
                  </label>
                  <div className="w-full px-4 py-3.5 bg-pink-50 border border-pink-100 rounded-lg text-pink-700 text-sm font-bold">
                    {node.aiAnswer || "AI answer is not available for this topic."}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {showAIAnswer ? "AI Answer" : "Your Answer"}
                  </label>
                  {!isEditing && (
                    <button
                      onClick={() => setShowAIAnswer(!showAIAnswer)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showAIAnswer ? "Write your answer" : "See AI answer"}
                    </button>
                  )}
                </div>
                
                {showAIAnswer && !isEditing ? (
                  <div className="w-full px-4 py-3.5 bg-pink-50 border border-pink-100 rounded-lg text-pink-700 text-sm min-h-[160px] font-bold">
                    {node.aiAnswer || "AI answer is not available for this topic."}
                  </div>
                ) : (
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-[160px] px-4 py-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    placeholder="Share your thoughts about this topic..."
                  />
                )}
              </>
            )}
          </div>
        </div>
        {(!hasUserAnswer || isEditing) && !showAIAnswer && (
          <div className="px-5 pb-5 space-y-3">
            <button
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              onClick={async () => {
                if (answer.trim() && node) {
                  try {
                    await saveAnswer(node.id, answer);
                    setGraphData(prevData => ({
                      ...prevData,
                      nodes: prevData.nodes.map(n => 
                        n.id === node.id 
                          ? { ...n, userAnswer: answer }
                          : n
                      )
                    }));
                    setIsEditing(false);
                    handleClose();
                  } catch (error) {
                    console.error('Failed to save answer:', error);
                    // 에러 처리 (예: 사용자에게 알림)
                  }
                }
              }}
            >
              {isEditing ? "Save changes" : "Save"}
            </button>
            {isEditing && (
              <button
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                onClick={() => {
                  setIsEditing(false);
                  setAnswer(node.userAnswer || '');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 데이터베이스 노드를 시각화 노드로 변환하는 함수
const convertDBNodesToGraphData = (dbNodes: DBNode[] = []): GraphData => {
  if (!dbNodes.length) return { nodes: [], links: [] };

  // parent_id가 null인 노드를 찾아 중앙 노드로 설정
  const mainNode = dbNodes.find(node => node.parent_id === null);
  if (!mainNode) return { nodes: [], links: [] };

  const nodes: Node[] = [
    // 중앙 노드 (parent_id가 null인 노드)
    {
      id: mainNode.id.toString(),
      name: mainNode.keyword,
      val: 8,
      color: '#1e293b',
      description: mainNode.node_question[0]?.question || 'Main topic',
      score: mainNode.node_question[0]?.Score,
      userAnswer: mainNode.node_question[0]?.node_answer_user[0]?.answer_user,
      aiAnswer: mainNode.node_question[0]?.node_answer_ai[0]?.answer_ai
    },
    // 나머지 노드들을 변환 (중앙 노드 제외)
    ...dbNodes
      .filter(node => node.id !== mainNode.id)
      .map(node => ({
        id: node.id.toString(),
        name: node.keyword,
        val: 6,
        color: '#334155',
        description: node.node_question[0]?.question || 'No question available',
        score: node.node_question[0]?.Score,
        userAnswer: node.node_question[0]?.node_answer_user[0]?.answer_user,
        aiAnswer: node.node_question[0]?.node_answer_ai[0]?.answer_ai
      }))
  ];

  // 연결선 생성 (parent_id가 null인 노드는 제외)
  const links: Link[] = dbNodes
    .filter(node => node.id !== mainNode.id)
    .map(node => ({
      source: node.parent_id!.toString(),
      target: node.id.toString(),
      color: '#475569'
    }));

  return { nodes, links };
};

export default function MindMap({ nodes: dbNodes }: MindMapProps) {
  const fgRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodePosition, setNodePosition] = useState<{ x: number; y: number } | undefined>(undefined)
  const [graphData, setGraphData] = useState<GraphData>(convertDBNodesToGraphData(dbNodes))

  // 컴포넌트 마운트 시 상태 업데이트
  useEffect(() => {
    setMounted(true)
  }, [])

  // dbNodes가 변경될 때 그래프 데이터 업데이트
  useEffect(() => {
    setGraphData(convertDBNodesToGraphData(dbNodes));
  }, [dbNodes]);

  // 노드 클릭 이벤트 핸들러
  const handleNodeClick = useCallback((node: any, event: MouseEvent) => {
    // parent_id가 null인 메인 노드는 클릭해도 모달창이 열리지 않음
    const mainNode = dbNodes?.find(n => n.parent_id === null);
    if (mainNode && node.id === mainNode.id.toString()) return;

    if (fgRef.current) {
      // 클릭한 노드로 부드럽게 이동
      fgRef.current.centerAt(node.x, node.y, 1000)
      fgRef.current.zoom(2.5, 1000)

      // ForceGraph DOM 요소 가져오기
      const graphElem = document.querySelector('.force-graph-container');
      if (!graphElem) return;
      
      const rect = graphElem.getBoundingClientRect();
      const scale = fgRef.current.zoom();
      
      // 노드의 실제 화면 좌표 계산
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);
      
      const nodeScreenX = centerX + (node.x * scale);
      const nodeScreenY = centerY + (node.y * scale);

      setSelectedNode(node as Node)
      setNodePosition({ x: nodeScreenX, y: nodeScreenY })
    }
  }, [dbNodes])

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setSelectedNode(null)
    setNodePosition(undefined)
  }, [])

  // 초기 설정 및 물리 시뮬레이션 파라미터 설정
  useEffect(() => {
    if (fgRef.current) {
      // 초기 줌 레벨을 더 크게 설정
      fgRef.current.zoom(6)
      
      // 물리 시뮬레이션 힘 설정
      // charge: 노드 간 반발력을 더 강하게 설정
      fgRef.current.d3Force('charge')?.strength(-8000)
      // link: 연결된 노드 간 거리를 더 멀게 설정
      fgRef.current.d3Force('link')?.distance(5000)
      
      const graphWidth = window.innerWidth - 240;
      const graphHeight = window.innerHeight;
      
      // center force의 중심점을 그래프의 중앙으로 설정하고 강도를 낮춤
      const centerForce = fgRef.current.d3Force('center');
      if (centerForce) {
        centerForce
          .x(graphWidth / 2)
          .y(graphHeight / 2)
          .strength(0.5);  // 중심으로 모이는 힘을 약하게 설정
      }

      // 초기 위치를 그래프의 중앙으로 설정
      fgRef.current.centerAt(graphWidth / 2, graphHeight / 2, 1000);
    }
  }, [])

  // 컴포넌트가 마운트되지 않은 경우 아무것도 렌더링하지 않음
  if (!mounted) return null

  return (
    <div className="flex-1 w-full h-full bg-gray-100">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={window.innerWidth - 240}
        height={window.innerHeight}
        nodeLabel="name"
        nodeColor={(node: any) => node.color}  // 노드 색상
        nodeVal={(node: any) => node.val * 2}      // 노드 크기를 2배로
        linkColor={(link: any) => link.color}  // 연결선 색상
        linkWidth={0.8}                     // 연결선 두께
        backgroundColor="#F1F5F9"           // 배경 색상
        onNodeClick={handleNodeClick}       // 노드 클릭 이벤트
        // 노드 커스텀 렌더링
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name
          // 글자 크기 설정 (줌 레벨에 따라 동적 조정)
          const fontSize = node.id === 'center' ? 16 / globalScale : 14 / globalScale
          ctx.font = `${fontSize}px Inter`
          
          // 노드 원 그리기
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.val / globalScale, 0, 3 * Math.PI, false)
          ctx.fillStyle = node.color
          ctx.fill()
          
          // 노드 레이블 그리기
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#475569'
          ctx.fillText(label, node.x + 10 / globalScale, node.y)
        }}
        cooldownTicks={100}                 // 초기 시뮬레이션 반복 횟수
        linkDirectionalParticles={0}        // 방향성 표시 입자 비활성화
        enableNodeDrag={true}              // 노드 드래그 비활성화
        enableZoomInteraction={true}        // 줌 인터랙션 활성화
        enablePanInteraction={true}         // 패닝 인터랙션 활성화
        minZoom={0.1}                       // 최소 줌 레벨
        maxZoom={8}                         // 최대 줌 레벨
      />
      <NodePanel 
        node={selectedNode} 
        onClose={handleCloseModal}
        position={nodePosition}
        fgRef={fgRef}
        setGraphData={setGraphData}
      />
    </div>
  )
} 
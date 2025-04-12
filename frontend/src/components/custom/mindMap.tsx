'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// ForceGraph2D를 클라이언트 사이드에서만 로드 (SSR 비활성화)
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
})

// 노드 데이터 타입 정의
interface Node {
  id: string        // 노드 고유 식별자
  name: string      // 노드에 표시될 텍스트
  val: number       // 노드 크기
  color: string     // 노드 색상
  description?: string  // 노드 설명
  x?: number        // x 좌표 (자동 계산)
  y?: number        // y 좌표 (자동 계산)
  vx?: number       // x축 속도 (물리 시뮬레이션용)
  vy?: number       // y축 속도 (물리 시뮬레이션용)
  fx?: number       // 고정 x 좌표 (선택적)
  fy?: number       // 고정 y 좌표 (선택적)
}

// 노드 간 연결선 타입 정의
interface Link {
  source: string    // 시작 노드 ID
  target: string    // 도착 노드 ID
  color: string     // 선 색상
}

// 전체 그래프 데이터 타입 정의
interface GraphData {
  nodes: Node[]
  links: Link[]
}

// 마인드맵 초기 데이터
const data: GraphData = {
  nodes: [
    // 중앙 노드 (메인 주제)
    { id: 'center', name: 'main title', val: 8, color: '#1e293b', description: 'This is the main topic of our mind map.' },
    // 주변 노드들 (서브 주제)
    { id: 'node1', name: 'idea 1', val: 6, color: '#334155', description: 'First key idea branching from the main topic.' },
    { id: 'node2', name: 'idea 2', val: 6, color: '#334155', description: 'Second key idea exploring another aspect.' },
    { id: 'node3', name: 'idea 3', val: 6, color: '#334155', description: 'Third key point connecting to the main theme.' },
    { id: 'node4', name: 'idea 4', val: 6, color: '#334155', description: 'Fourth concept completing the thought process.' },
  ],
  // 노드 간 연결 정의
  links: [
    { source: 'center', target: 'node1', color: '#475569' },
    { source: 'center', target: 'node2', color: '#475569' },
    { source: 'center', target: 'node3', color: '#475569' },
    { source: 'center', target: 'node4', color: '#475569' },
  ],
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
  const question = "이 주제에 대해 당신은 어떻게 생각하시나요?"; // 하드코딩된 질문

  if (!node) return null;
  
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20}/>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="text-gray-600 text-sm">
            <p>{node.description || 'No description available.'}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <div className="w-full px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-sm">
                {question}
              </div>
            </div>
            
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-[160px] px-4 py-3.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                placeholder="Enter your answer..."
              />
            </div>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            onClick={() => {
              if (answer.trim() && node) {
                const newNodeId = `node${Date.now()}`;
                const newNode = {
                  id: newNodeId,
                  name: answer,
                  val: 6,
                  color: '#334155',
                  description: `Response to: ${node.name}`
                };
                const newLink = {
                  source: node.id,
                  target: newNodeId,
                  color: '#475569'
                };
                setGraphData(prevData => ({
                  nodes: [...prevData.nodes, newNode],
                  links: [...prevData.links, newLink]
                }));
                onClose();
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function MindMap() {
  // ForceGraph 인스턴스에 대한 참조
  const fgRef = useRef<any>(null)
  // 컴포넌트 마운트 상태 관리 (클라이언트 사이드 렌더링 제어)
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodePosition, setNodePosition] = useState<{ x: number; y: number } | undefined>(undefined)
  const [graphData, setGraphData] = useState<GraphData>(data)

  // 컴포넌트 마운트 시 상태 업데이트
  useEffect(() => {
    setMounted(true)
  }, [])

  // 노드 클릭 이벤트 핸들러
  const handleNodeClick = useCallback((node: any, event: MouseEvent) => {
    // 메인 타이틀(center) 노드는 클릭해도 모달창이 열리지 않음
    if (node.id === 'center') return;

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
  }, [])

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
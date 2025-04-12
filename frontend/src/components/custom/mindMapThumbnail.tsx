'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
})

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

interface Node {
  id: string
  name: string
  val: number
  color: string
}

interface Link {
  source: string
  target: string
  color: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

interface MindMapThumbnailProps {
  nodes?: DBNode[]
}

const convertDBNodesToGraphData = (dbNodes: DBNode[] = []): GraphData => {
  if (!dbNodes.length) return { nodes: [], links: [] };

  const mainNode = dbNodes.find(node => node.parent_id === null);
  if (!mainNode) return { nodes: [], links: [] };

  const nodes: Node[] = [
    {
      id: mainNode.id.toString(),
      name: mainNode.keyword,
      val: 4,
      color: '#1e293b',
    },
    ...dbNodes
      .filter(node => node.id !== mainNode.id)
      .map(node => ({
        id: node.id.toString(),
        name: node.keyword,
        val: 3,
        color: '#334155',
      }))
  ];

  const links: Link[] = dbNodes
    .filter(node => node.id !== mainNode.id)
    .map(node => ({
      source: node.parent_id!.toString(),
      target: node.id.toString(),
      color: '#475569'
    }));

  return { nodes, links };
};

export function MindMapThumbnail({ nodes: dbNodes }: MindMapThumbnailProps) {
  const fgRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)
  const graphData = convertDBNodesToGraphData(dbNodes)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.zoom(3)
      fgRef.current.d3Force('charge')?.strength(-2000)
      fgRef.current.d3Force('link')?.distance(1000)
      
      const centerForce = fgRef.current.d3Force('center');
      if (centerForce) {
        centerForce
          .x(150)
          .y(100)
          .strength(0.5);
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full aspect-[996/664] relative bg-gray-100 rounded-sm">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={300}
        height={200}
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => (node.val || 1) * 1.5}
        linkColor={(link: any) => link.color}
        linkWidth={0.5}
        backgroundColor="#F1F5F9"
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          ctx.beginPath()
          ctx.arc(node.x, node.y, (node.val || 1) / globalScale, 0, 3 * Math.PI, false)
          ctx.fillStyle = node.color
          ctx.fill()
        }}
        cooldownTicks={50}
        enableNodeDrag={false}
        enableZoomInteraction={false}
        enablePanInteraction={false}
      />
    </div>
  )
} 
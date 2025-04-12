import { supabase } from "@/lib/supabase"
import SideBar from "@/components/custom/sidebar"
import MindMap from "@/components/custom/mindMap"

export default async function IdPage({
  params
}: {
  params: { id: string }
}) {
  // 프로젝트의 모든 노드 가져오기
  const { data: nodes, error: nodesError } = await supabase
    .from('node')
    .select(`
      *,
      node_question(
        id,
        question,
        created_at,
        Score,
        node_answer_ai(
          id,
          answer_ai,
          created_at
        ),
        node_answer_user(
          id,
          answer_user,
          created_at
        )
      )
    `)
    .eq('project_id', params.id);

  if (nodesError) {
    console.error('Error fetching nodes:', nodesError);
    return <div>Error loading nodes</div>;
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-[240px] border-r border-gray-800">
        <SideBar currentProjectId={params.id} />
      </div>
      <div className="flex-1 overflow-hidden">
        <MindMap nodes={nodes} />
      </div>
    </div>
  )
}
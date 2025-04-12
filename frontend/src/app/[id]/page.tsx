import { supabase } from "@/lib/supabase"
import SideBar from "@/components/custom/sidebar"
import MindMap from "@/components/custom/mindMap"

interface Project {
  id: string
  title: string
  description: string
  created_at: string
}

async function getProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects
}

export default async function IdPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = await Promise.resolve(params)
  const projects = await getProjects()

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
    .eq('project_id', id)

  if (nodesError) {
    console.error('Error fetching nodes:', nodesError)
    return <div>Error loading nodes</div>
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-[240px] border-r border-gray-800">
        <SideBar projects={projects} currentProjectId={id} />
      </div>
      <div className="flex-1 overflow-hidden">
        <MindMap nodes={nodes} />
      </div>
    </div>
  )
}
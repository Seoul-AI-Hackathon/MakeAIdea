import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/custom/sidebar'
import MainContent from '@/components/custom/mainContent'

interface Project {
  id: string
  title: string
  description: string
  created_at: string
}

async function getProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects
}

export default async function Home() {
  const projects = await getProjects()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar projects={projects} />
      <MainContent projects={projects} />
    </div>
  )
}


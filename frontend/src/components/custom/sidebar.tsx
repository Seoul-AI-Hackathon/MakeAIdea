import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface Project {
  id: string
  title: string
}

interface NavItemProps {
  href: string
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg", active && "bg-gray-100")}
    >
      <span className="text-gray-400">-</span>
      <span>{children}</span>
    </Link>
  )
}

interface SideBarProps {
  projects?: Project[]
  currentProjectId?: string
}

export default function SideBar({ projects = [], currentProjectId }: SideBarProps) {
  return (
    <div className="w-[240px] border-r bg-white flex flex-col h-screen">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
          <Link
            href={'/'}
          >
            <Menu className="h-4 w-4" />
          </Link>
          <span>Project List</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 pt-6 space-y-[2px]">
          {projects?.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No projects yet
            </div>
          ) : (
            projects.map((project) => (
              <NavItem 
                key={project.id}
                href={`/${project.id}`}
                active={project.id === currentProjectId}
              >
                {project.title}
              </NavItem>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import StartProjectModal from "./startProjectModal"
import { ProjectCard } from "./projectCard"

interface Project {
  id: string
  title: string
  description: string
  created_at: string
}

interface MainContentProps {
  projects: Project[]
}

export default function MainContent({ projects }: MainContentProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Open Aldeas</h1>
      <p className="text-gray-600 text-center mb-8">
        Upload a video and explore with mindmap powered by AI-<br/>
        generated questions and responses.
      </p>
      <Button 
        className="bg-gray-900 text-white hover:bg-gray-800"
        onClick={() => setShowModal(true)}
      >
        Summarize now
      </Button>

      <div className="w-full max-w-6xl mt-16">
        <h2 className="text-lg font-medium mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              thumbnail="/img-placeholder.svg"
            />
          ))}
        </div>
      </div>

      {showModal && (
        <StartProjectModal 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  )
} 
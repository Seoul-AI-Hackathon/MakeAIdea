import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
}

export function ProjectCard({ id, title, description, thumbnail }: ProjectCardProps) {
  return (
    <Link
      href={`/${id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-1">
        <div className="aspect-[16/9] relative bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Link>
  )
} 
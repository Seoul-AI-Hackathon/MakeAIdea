import Image from "next/image"
import Link from "next/link"

interface ChatHistoryCardProps {
  title: string
  description: string
  thumbnail: string
}

export function ChatHistoryCard({ title, description, thumbnail }: ChatHistoryCardProps) {
  return (
    <Link
      href={`/${title}`}
    >
      <div className="overflow-hidden rounded-lg border bg-white p-4 hover:border-gray-300 transition-colors">
        <div className="aspect-[996/664] relative bg-gray-100 rounded-sm mb-4">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  )
} 
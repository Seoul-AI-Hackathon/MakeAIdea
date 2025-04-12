

import SideBar from "@/components/custom/sidebar"
import MindMap from "@/components/custom/mindMap"

const SAMPLE_CHATS = [
  { id: '1', title: 'Chat 1' },
  { id: '2', title: 'Chat 2' },
  { id: '3', title: 'Chat 3' },
]

export default function IdPage({
  params
}: {
  params: { id: string }
}) {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-[240px] border-r border-gray-800">
        <SideBar chats={SAMPLE_CHATS} />
      </div>
      <div className="flex-1 overflow-hidden">
        <MindMap />
      </div>
    </div>
  )
}
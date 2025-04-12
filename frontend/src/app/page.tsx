import SideBar from "@/components/custom/sidebar"
import MainContent from "@/components/custom/mainContent"
import { supabase } from "@/lib/supabase"

const SAMPLE_CHATS = [
  { id: '1', title: 'Chat 1' },
  { id: '2', title: 'Chat 2' },
  { id: '3', title: 'Chat 3' },
]

export default function MainPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <SideBar chats={SAMPLE_CHATS} />
      <MainContent />
    </div>
  )
}


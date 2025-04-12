'use client'

import Modal from "../ui/modal"
import {Link as LinkIcon } from "lucide-react"

interface StartProjectModalProps {
  onClose: () => void;
}

export default function StartProjectModal({ onClose }: StartProjectModalProps) {
  return (
    <Modal 
      onClose={onClose}
      className="w-[700px] p-10"
    >
      <h2 className="text-lg font-semibold mb-2">Start a new conversation</h2>
      <p className="text-sm text-gray-600 mb-4">Name your idea and start exploring.</p>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1.5">Upload your file</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Write a video link here"
              className="w-full px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2">
              <LinkIcon size={16}/>
            </button>
          </div>
        </div>
        <button className="w-full bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Start a conversation
        </button>
      </div>
    </Modal>
  )
}
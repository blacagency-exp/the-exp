"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp, Map } from "lucide-react"
import type { Tour } from "../../types/tour-types"

interface SceneNavigationProps {
  tour: Tour
  currentSceneId: number
  tourId: string | number
}

export default function SceneNavigation({ tour, currentSceneId, tourId }: SceneNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleSceneClick = (sceneId: number) => {
    navigate(`/virtual-tour/${tourId}?scene=${sceneId}`)
    setIsOpen(false)
  }

  return (
    <div className="absolute right-4 bottom-24 z-30">
      <div className="flex flex-col items-end">
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#1A2E0D]/90 hover:bg-[#2A4A15] text-white p-3 rounded-full flex items-center gap-2 mb-2 transition-colors shadow-lg"
          aria-label={isOpen ? "Close scene navigation" : "Open scene navigation"}
        >
          <Map size={20} />
          <span className="font-medium">Scenes</span>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {/* Scene list */}
        {isOpen && (
          <div className="bg-[#1A2E0D]/95 rounded-lg p-3 shadow-xl animate-fadeIn max-h-[60vh] overflow-y-auto w-64">
            <h3 className="text-[#97E12B] font-medium mb-2 text-center border-b border-[#97E12B]/30 pb-2">
              Jump to Scene
            </h3>
            <ul className="space-y-2">
              {tour.scenes.map((scene) => (
                <li key={scene.id}>
                  <button
                    onClick={() => handleSceneClick(scene.id)}
                    disabled={scene.id === currentSceneId}
                    className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors ${
                      scene.id === currentSceneId
                        ? "bg-[#97E12B]/20 text-[#97E12B] cursor-not-allowed"
                        : "hover:bg-[#97E12B]/30 text-white"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        scene.id === currentSceneId ? "bg-[#97E12B]/40" : "bg-[#97E12B]/20"
                      }`}
                    >
                      {scene.id}
                    </div>
                    <span className="truncate">{scene.title || `Scene ${scene.id}`}</span>
                    {scene.id === currentSceneId && (
                      <span className="ml-auto text-xs bg-[#97E12B]/30 px-2 py-1 rounded">Current</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

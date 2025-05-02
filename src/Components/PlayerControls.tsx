"use client"

import { Play, Pause, Volume2, VolumeX, RefreshCw, ChevronRight, Settings } from "lucide-react"
import { getQualityLabel } from "../utils/youtube-utils"

interface PlayerControlsProps {
  isPlaying: boolean
  isMuted: boolean
  currentQuality: string
  availableQualities: string[]
  currentScene: any
  handlePlayPause: () => void
  handleToggleMute: () => void
  handleReplay: () => void
  handleQualityChange: (quality: string) => void
  handleTransition: (nextSceneId: number) => void
}

export default function PlayerControls({
  isPlaying,
  isMuted,
  currentQuality,
  availableQualities,
  currentScene,
  handlePlayPause,
  handleToggleMute,
  handleReplay,
  handleQualityChange,
  handleTransition,
}: PlayerControlsProps) {
  return (
    <div className="bg-[#1A2E0D]/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-4 shadow-lg">
      <button onClick={handlePlayPause} className="text-white hover:text-[#97E12B] transition-colors">
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <button onClick={handleToggleMute} className="text-white hover:text-[#97E12B] transition-colors">
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <button onClick={handleReplay} className="text-white hover:text-[#97E12B] transition-colors">
        <RefreshCw size={24} />
      </button>

      {/* Improved Quality selector button */}
      <div className="relative group">
        <button className="flex items-center gap-1 text-white bg-[#97E12B] hover:bg-[#86c728] px-3 py-1 rounded-full transition-colors">
          <Settings size={16} />
          <span className="text-sm text-[#1A2E0D] font-medium">
            {currentQuality ? getQualityLabel(currentQuality) : "Quality"}
          </span>
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1A2E0D] rounded-lg p-2 hidden group-hover:block min-w-[120px] shadow-lg">
          <div className="text-xs text-[#97E12B] font-medium mb-1 px-3">Video Quality</div>
          {availableQualities.map((quality) => (
            <button
              key={quality}
              onClick={(e) => {
                e.stopPropagation() // Prevent event bubbling
                handleQualityChange(quality)
              }}
              className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[#97E12B]/20 ${
                currentQuality === quality ? "bg-[#97E12B]/30 text-[#97E12B]" : "text-white"
              }`}
            >
              {getQualityLabel(quality)}
            </button>
          ))}
        </div>
      </div>

      {currentScene?.nextSceneId && (
        <button
          onClick={() => handleTransition(currentScene.nextSceneId)}
          className="flex items-center gap-1 text-white bg-[#97E12B]/20 hover:bg-[#97E12B]/40 px-3 py-1 rounded-full transition-colors"
        >
          <span>Skip</span>
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

"use client"

import type { HotspotState } from "../types/tour-types"

interface HotspotMarkerProps {
  hotspot: HotspotState
  onHotspotClick: (targetSceneId: number) => void
}

export default function HotspotMarker({ hotspot, onHotspotClick }: HotspotMarkerProps) {
  if (!hotspot.visible) return null

  return (
    <button
      key={hotspot.id}
      onClick={() => onHotspotClick(hotspot.targetSceneId)}
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
      }}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-[#97E12B] flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-[#97E12B]/50"></div>

        {/* Hotspot tooltip */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-48 bg-[#1A2E0D]/90 text-white rounded-lg p-2 text-sm">
          <h3 className="font-medium text-[#97E12B] mb-1">{hotspot.title}</h3>
          <p className="text-xs text-white/90">{hotspot.description}</p>
        </div>
      </div>
    </button>
  )
}

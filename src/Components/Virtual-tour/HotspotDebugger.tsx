"use client"

import type React from "react"
import { useEffect } from "react"

interface HotspotDebuggerProps {
  onHotspotClick: (targetSceneId: number) => void
}

const HotspotDebugger: React.FC<HotspotDebuggerProps> = ({ onHotspotClick }) => {
  useEffect(() => {
    // Create a global function to test hotspot clicks
    window.testHotspotClick = (sceneId: number) => {
      console.log("Testing hotspot click for scene:", sceneId)
      onHotspotClick(sceneId)
    }

    // Log that the debugger is active
    console.log("Hotspot debugger active. Use window.testHotspotClick(sceneId) to test hotspot navigation.")

    return () => {
      delete window.testHotspotClick
    }
  }, [onHotspotClick])

  return (
    <div className="absolute bottom-20 left-5 z-50 bg-black bg-opacity-70 p-2 text-white text-xs">
      <p>Hotspot Debugger Active</p>
      <p>Test hotspots in console with:</p>
      <p className="font-mono">window.testHotspotClick(sceneId)</p>
      <div className="mt-2">
        <button onClick={() => onHotspotClick(2)} className="px-2 py-1 bg-[#97E12B] text-black rounded mr-2">
          Test Scene 2
        </button>
        <button onClick={() => onHotspotClick(1)} className="px-2 py-1 bg-[#97E12B] text-black rounded">
          Test Scene 1
        </button>
      </div>
    </div>
  )
}

// Add to window type
declare global {
  interface Window {
    testHotspotClick?: (sceneId: number) => void
  }
}

export default HotspotDebugger


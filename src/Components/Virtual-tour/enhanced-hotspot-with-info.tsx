"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface HotspotProps {
  id: string
  position: { x: number; y: number }
  targetSceneId: number
  title: string
  description: string
  icon?: string
  onClick: (targetSceneId: number) => void
}

export function EnhancedHotspot({ id, position, targetSceneId, title, description, icon, onClick }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hotspot button */}
      <button onClick={() => onClick(targetSceneId)} className="relative group" aria-label={`Hotspot to ${title}`}>
        <div className="w-12 h-12 rounded-full bg-[#97E12B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping-smooth bg-[#97E12B]/50"></div>
      </button>

      {/* Information tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-1/2 transform -translate-x-1/2 w-64 bg-[#1A2E0D]/90 backdrop-blur-sm text-white rounded-lg shadow-lg p-3 pointer-events-none"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1A2E0D]/90 rotate-45"></div>
            <h3 className="font-medium text-[#97E12B] mb-1">{title}</h3>
            <p className="text-sm text-white/90 mb-2">{description}</p>
            <div className="flex items-center text-xs text-[#97E12B]">
              <span>Click to explore</span>
              <ChevronRight size={14} className="ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-hover information tag that appears briefly */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{
              duration: 0.3,
              delay: 0.5,
              opacity: { duration: 0.3 },
            }}
            className="absolute top-1 left-14 whitespace-nowrap bg-[#1A2E0D]/80 text-white text-sm px-3 py-1 rounded-full pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

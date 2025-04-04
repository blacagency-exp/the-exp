"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ClickableHotspotProps {
  position: { x: number; y: number }
  targetSceneId: number
  tooltip?: string
  onHotspotClick: (targetSceneId: number) => void
}

const ClickableHotspot: React.FC<ClickableHotspotProps> = ({ position, targetSceneId, tooltip, onHotspotClick }) => {
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
        },
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        console.log("DOM Hotspot clicked:", targetSceneId)
        onHotspotClick(targetSceneId)
      }}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-[#97E12B] rounded-full flex items-center justify-center shadow-lg">
          {/* Pulsing animation */}
          <motion.div
            className="absolute w-full h-full rounded-full bg-[#97E12B] opacity-70"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
          <span className="text-black font-bold text-lg">{targetSceneId}</span>
        </div>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap"
          >
            {tooltip}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ClickableHotspot


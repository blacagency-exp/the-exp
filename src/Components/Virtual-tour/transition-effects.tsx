"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TransitionOverlayProps {
  isActive: boolean
  message?: string
  duration?: number
  onComplete?: () => void
}

export function TransitionOverlay({
  isActive,
  message = "Transitioning to next scene...",
  duration = 2000,
  onComplete,
}: TransitionOverlayProps) {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Clean up function to cancel any animation frame
    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    if (!isActive) {
      cleanup()
      setProgress(0)
      startTimeRef.current = null
      return cleanup
    }

    // Set the start time when the transition becomes active
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now()
    }

    // Animation function using requestAnimationFrame for smoother animation
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return

      const elapsed = currentTime - startTimeRef.current
      const newProgress = Math.min((elapsed / duration) * 100, 100)

      setProgress(newProgress)

      if (newProgress < 100) {
        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        if (onComplete) {
          // Add a small delay before completing the transition
          // This helps ensure the player is properly cleaned up
          setTimeout(() => {
            onComplete()
          }, 100)
        }
        startTimeRef.current = null
      }
    }

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Clean up on unmount or when isActive changes
    return cleanup
  }, [isActive, duration, onComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-xl font-medium mb-8"
          >
            {message}
          </motion.div>

          <div className="w-64 h-3 bg-[#1A2E0D] rounded-full overflow-hidden">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-[#97E12B] rounded-full transition-all duration-100 ease-linear"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SceneTransitionEffect({
  fromScene,
  toScene,
  isActive,
  onComplete,
}: {
  fromScene: number
  toScene: number
  isActive: boolean
  onComplete: () => void
}) {
  return (
    <TransitionOverlay
      isActive={isActive}
      message={`Transitioning to Scene ${toScene}`}
      duration={1500}
      onComplete={onComplete}
    />
  )
}

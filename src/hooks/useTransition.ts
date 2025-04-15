"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export function useTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const transitionTimeoutRef = useRef<number | null>(null)
  const navigate = useNavigate()

  const handleTransition = (nextSceneId: number, currentTour: any, playerRef: React.MutableRefObject<any>) => {
    console.log(`Attempting transition to scene ${nextSceneId}`)

    if (isTransitioning) {
      console.log("Already transitioning, ignoring request")
      return
    }

    if (!nextSceneId) {
      console.error("No next scene ID provided for transition")
      return
    }

    // Start transition
    setIsTransitioning(true)
    setTransitionProgress(0)

    // Pause the video
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      try {
        playerRef.current.pauseVideo()
      } catch (err) {
        console.error("Error pausing video:", err)
      }
    }

    // Simplified transition with setTimeout instead of requestAnimationFrame
    // Update progress in steps
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTransitionProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Use navigate from react-router-dom instead of window.location
        navigate(`/virtual-tour/${currentTour.id}?scene=${nextSceneId}`)

        // Reset transition state after navigation
        setTimeout(() => {
          setIsTransitioning(false)
          setTransitionProgress(0)
        }, 100)
      }
    }, 150) // 150ms per step = ~1.5 seconds total

    // Store the interval ID for cleanup
    transitionTimeoutRef.current = interval as unknown as number
  }

  // Clean up function
  const cleanupTransition = () => {
    if (transitionTimeoutRef.current) {
      clearInterval(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
  }

  return {
    isTransitioning,
    transitionProgress,
    handleTransition,
    cleanupTransition,
  }
}

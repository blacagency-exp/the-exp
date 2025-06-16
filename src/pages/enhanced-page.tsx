"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Maximize, Minimize, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

// Import components
import HotspotMarker from "../Components/HotspotMarker"
import PlayerControls from "../Components/PlayerControls"
import TransitionOverlay from "../Components/TransitionOverlay"
import SceneDescription from "../Components/SceneDescription"
import SceneNavigation from "../Components/Virtual-tour/SceneNavigation"
import PlaybackControls from "../Components/PlaybackControls"
// import DebugInfo from "../Components/DebugInfo"

// Import hooks and utilities
import { useYouTubePlayer } from "../hooks/useYouTubePlayer"
import { useTransition } from "../hooks/useTransition"
import { extractYouTubeId } from "../utils/youtube-utils"
import { activeTours, previewTours } from "../data/tour-data"
import { playerStyles } from "../styles/player-style"
import type { HotspotState } from "../types/tour-types"

export default function EnhancedSingleVirtualTourPage() {
  const { tourId } = useParams<{ tourId: string }>()
  const [searchParams] = useSearchParams()
  const sceneId = Number.parseInt(searchParams.get("scene") || "1")
  const navigate = useNavigate()

  // State
  const [currentTour, setCurrentTour] = useState<any>(null)
  const [currentScene, setCurrentScene] = useState<any>(null)
  const [hotspots, setHotspots] = useState<HotspotState[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string>("")

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  // Custom hooks
  const { isTransitioning, transitionProgress, cleanupTransition } = useTransition()

  const {
    playerRef,
    isLoading,
    isPlaying,
    isMuted,
    playerTime,
    playerDuration,
    playerReady,
   
    showEndPrompt,
    endPromptType,
    availableQualities,
    currentQuality,
    setShowEndPrompt,
   
    handlePlayPause,
    handleToggleMute,
    handleReplay,
    handleQualityChange,
    seekTo,
    skipForward,
    skipBackward,
    
  } = useYouTubePlayer(videoId, currentScene, playerContainerRef, isTransitioning)

  // Add CSS styles for YouTube player with controls hidden
  useEffect(() => {
    const styleId = "youtube-player-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.innerHTML = playerStyles
      document.head.appendChild(style)
    }
  }, [])

  // Find the current tour and scene
  useEffect(() => {
    const isPreview = searchParams.get("preview") === "true"
    const sourceTours = isPreview ? previewTours : activeTours
    // find only in the chosen list
  const parsedTourId = Number(tourId || "1")
  const foundTour = sourceTours.find((t) => t.id === parsedTourId) 
                   || (isPreview
                       ? previewTours.find((t) => t.id === parsedTourId)
                       : activeTours.find((t) => t.id === parsedTourId))
                   || sourceTours[0]

  setCurrentTour(foundTour)

    if (foundTour) {
      const foundScene = foundTour.scenes.find((scene) => scene.id === sceneId) || foundTour.scenes[0]
      setCurrentScene(foundScene)

      // Extract video ID
      const extractedId = extractYouTubeId(foundScene.youtubeId)
      setVideoId(extractedId)

      // Initialize hotspots as invisible
      if (foundScene.hotspots) {
        setHotspots(
          foundScene.hotspots.map((hotspot) => ({
            ...hotspot,
            visible: false,
          })),
        )
      }

      // Reset end prompt state
      setShowEndPrompt(false)
    }
  }, [tourId, sceneId, searchParams, setShowEndPrompt])

  // Update hotspot visibility based on player time
  useEffect(() => {
    if (currentScene?.hotspots && playerTime > 0) {
      setHotspots((prevHotspots) =>
        prevHotspots.map((hotspot) => {
          const shouldBeVisible = playerTime >= hotspot.startTime
          return {
            ...hotspot,
            visible: shouldBeVisible,
          }
        }),
      )
    }
  }, [currentScene, playerTime])

  // Add global protection against keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+U (view source), Ctrl+S (save), Ctrl+S (save), Ctrl+C (copy), etc.
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "s" || e.key === "c")) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle back button click
  const handleBackClick = () => {
    navigate("/virtual-tour")
  }

  // Handle hotspot click
  const handleHotspotClick = (targetSceneId: number) => {
    console.log(`Hotspot clicked for scene ${targetSceneId}`)

    // Directly transition to the target scene
    if (targetSceneId) {
      // Store the target scene ID for later use
      window.tempTargetSceneId = targetSceneId

      // Use React Router navigation
      navigate(`/virtual-tour/${currentTour.id}?scene=${targetSceneId}`)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupTransition()
    }
  }, [cleanupTransition])

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center flex-col">
        <div className="text-white text-xl mb-4">Error: {error}</div>
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-white bg-[#1A2E0D] hover:bg-[#2A4A15] px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Tours</span>
        </button>
      </div>
    )
  }

  // If tour or scene is not loaded yet, show loading
  if (!currentTour || !currentScene) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading tour...</div>
      </div>
    )
  }

  return (
    <div
      className="w-full h-screen bg-black relative overflow-hidden"
      ref={containerRef}
      onContextMenu={handleContextMenu}
    >
      {/* YouTube player */}
      <div
        id="youtube-player-container"
        className="w-full h-full relative bg-black"
        ref={playerContainerRef}
        onContextMenu={(e) => {
          e.preventDefault()
          return false
        }}
      >
        <div id="youtube-player" className="w-full h-full"></div>

        {/* Transparent overlay to prevent right-click and other interactions */}
        <div
          className="absolute inset-0 z-10"
          onContextMenu={(e) => {
            e.preventDefault()
            return false
          }}
          onClick={(e) => {
            // Allow click to toggle play/pause
            if (!isTransitioning && playerRef.current) {
              handlePlayPause()
              e.preventDefault()
            }
          }}
        ></div>
      </div>

      {/* UI controls */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center">
        {/* Back button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-white bg-[#1A2E0D]/80 hover:bg-[#2A4A15] px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Tour title */}
        <div className="text-white text-lg font-medium bg-[#1A2E0D]/80 px-4 py-2 rounded-full">
          {currentTour.title} - {currentScene.title || `Scene ${sceneId}`}
        </div>

        {/* Fullscreen toggle */}
        <button
          className="text-white bg-[#1A2E0D]/80 hover:bg-[#2A4A15] p-2 rounded-full transition-colors"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Scene Navigation Component */}
      {currentTour && <SceneNavigation tour={currentTour} currentSceneId={sceneId} tourId={tourId || 1} />}

      {/* Playback Controls */}
      {playerReady && !isLoading && !showEndPrompt && (
        <div className="absolute bottom-0 left-0 right-0 z-20 unified-controls pt-16">
          <PlaybackControls
            currentTime={playerTime}
            duration={playerDuration}
            onSeek={seekTo}
            onForward={skipForward}
            onRewind={skipBackward}
          />
        </div>
      )}

      {/* Player Controls - Now positioned separately and higher up */}
      {playerReady && !isLoading && !showEndPrompt && (
        <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center">
          <PlayerControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentQuality={currentQuality}
            availableQualities={availableQualities}
            currentScene={currentScene}
            handlePlayPause={handlePlayPause}
            handleToggleMute={handleToggleMute}
            handleReplay={handleReplay}
            handleQualityChange={(quality) => {
              console.log(`Quality change requested: ${quality}`)
              handleQualityChange(quality)
            }}
            handleTransition={(nextSceneId) => {
              // Use React Router navigation
              navigate(`/virtual-tour/${currentTour.id}?scene=${nextSceneId}`)
            }}
          />
        </div>
      )}

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} onHotspotClick={handleHotspotClick} />
      ))}

      {/* Loading overlay - only show when initially loading, not during end prompt */}
      {isLoading && !showEndPrompt && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
          <div className="text-white text-xl flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#97E12B]/30 border-t-[#97E12B] rounded-full animate-spin mb-4"></div>
            <div>Loading video...</div>
          </div>
        </div>
      )}

     
        {/* End Prompt */}
        {showEndPrompt && (
          <motion.div
            className="fixed inset-0 flex  items-center justify-center bg-black/50 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-[#223D13] p-8 rounded-2xl shadow-lg text-center w-full max-w-md relative z-50">
              <h2 className="text-[#97E12B] text-2xl font-bold mb-2 animate-slideDown">
                {currentTour.scenes.length > 1
                  ? endPromptType === "auto"
                    ? "You've reached the end of this scene!"
                    : "Explore a new location?"
                  : "End of Preview"}
              </h2>
              {/* Prompt Text */}

              <p className="text-white mb-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                {currentTour.scenes.length > 1
                  ? endPromptType === "auto"
                    ? "Would you like to continue to the next scene or replay this one?"
                    : "Would you like to visit this new location or continue exploring the current scene?"
                  : "Would you like to replay this preview?"}
              </p>

              {/* Buttons */}

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
              >
                {/* Only show "Continue to Next Scene" button for multi-scene tours (not preview tours) */}
                {currentTour.scenes.length > 1 && (
                  <button
                    onClick={() => {
                      const targetSceneId =
                        endPromptType === "auto" ? currentScene.nextSceneId : window.tempTargetSceneId || 1
                      // Use React Router navigation
                      navigate(`/virtual-tour/${currentTour.id}?scene=${targetSceneId}`)
                    }}
                    className="bg-[#97E12B] text-[#1A2E0D] px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#86c728] transition-colors animate-pulse"
                  >
                    {currentScene.id === 5
                      ? "Restart All Over"
                      : endPromptType === "auto"
                        ? "Continue to Next Scene"
                        : "Go to New Location"}
                    <ChevronRight size={20} />
                  </button>
                )}

                <button
                  onClick={handleReplay}
                  className="bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors"
                >
                  {currentTour.scenes.length > 1
                    ? currentScene.id === 5
                      ? "Restart This Scene"
                      : endPromptType === "auto"
                        ? "Replay This Scene"
                        : "Stay Here"
                    : "Replay Preview"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

      {/* Transition overlay */}
      <TransitionOverlay isTransitioning={isTransitioning} transitionProgress={transitionProgress} />

      {/* Scene description */}
      <SceneDescription scene={currentScene} sceneId={sceneId} />

      {/* Debug info */}
      {/* <DebugInfo playerTime={playerTime} currentScene={currentScene} hotspots={hotspots} /> */}
    </div>
  )
}

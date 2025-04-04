"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import "aframe"
import { motion } from "framer-motion"
import { Play, Volume2, VolumeX, RefreshCw, AlertCircle, Settings, ChevronDown, Check } from "lucide-react"
import { LoadingSpinner } from "./LoadingSpinner"
import ClickableHotspot from "./ClickableHotspot"

// Define Hotspot type
interface Hotspot {
  id: number
  position: { x: number; y: number }
  targetSceneId: number
  startTime?: number
  endTime?: number
  tooltip?: string
}

// Define global hotspot handler type
declare global {
  interface Window {
    hotspotClickHandler?: (targetSceneId: number) => void
  }
}

// Add quality options
const videoQualityOptions = [
  { label: "Auto", value: "auto" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
]

// Add the NetworkInformation interface
interface NetworkInformation {
  downlink: number
  effectiveType: string
  rtt?: number
  saveData?: boolean
  onchange?: () => void
}

// Extend Navigator interface to include connection properties
interface NavigatorWithConnection extends Navigator {
  connection?: Omit<NetworkInformation, 'saveData'> & { saveData: boolean }
  mozConnection?: Omit<NetworkInformation, 'saveData'> & { saveData: boolean }
  webkitConnection?: Omit<NetworkInformation, 'saveData'> & { saveData: boolean }
}

// Update the SimpleVideoViewerProps to include quality settings
interface SimpleVideoViewerProps {
  videoUrl: string | null
  hotspots?: Hotspot[]
  onHotspotClick: (targetSceneId: number) => void
  autoPlay?: boolean
  onUserInteraction?: () => void
  initialQuality?: string
}

// Update the component implementation to include the new optimizations
const SimpleVideoViewer: React.FC<SimpleVideoViewerProps> = ({
  videoUrl,
  hotspots = [],
  onHotspotClick,
  autoPlay = false,
  onUserInteraction,
  initialQuality = "auto",
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [needsUserInteraction, setNeedsUserInteraction] = useState(!autoPlay)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMutedNotice, setShowMutedNotice] = useState(false)
  const [videoAttempted, setVideoAttempted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [visibleHotspots, setVisibleHotspots] = useState<Hotspot[]>([])
  const [bufferProgress, setBufferProgress] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState(initialQuality)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [networkQuality, setNetworkQuality] = useState<string>("unknown")
  const [videoDuration, setVideoDuration] = useState(0)
  const [lastBufferCheck, setLastBufferCheck] = useState(0)
  const [bufferStalls, setBufferStalls] = useState(0)
  const [showBufferingIndicator, setShowBufferingIndicator] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const sceneRef = useRef<HTMLElement | null>(null)
  const bufferCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const qualityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recoveryAttemptRef = useRef(0)

  // Set up the scene when component mounts
  useEffect(() => {
    console.log("Setting up scene and global handlers")

    // Register global hotspot click handler for DOM-based hotspots
    window.hotspotClickHandler = (sceneId) => {
      console.log("Global hotspot handler called with scene:", sceneId)
      onHotspotClick(sceneId)
    }

    // Monitor network conditions
    const monitorNetworkConditions = () => {
      const nav = navigator as NavigatorWithConnection
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection

      if (connection) {
        const { downlink, effectiveType } = connection
        console.log(`Network conditions: ${effectiveType}, downlink: ${downlink} Mbps`)
        setNetworkQuality(effectiveType)

        // Set up a listener for network changes
        const handleNetworkChange = () => {
          const { downlink, effectiveType } = connection
          console.log(`Network changed: ${effectiveType}, downlink: ${downlink} Mbps`)
          setNetworkQuality(effectiveType)

          // Adjust quality based on new network conditions if in auto mode
          if (selectedQuality === "auto" && videoRef.current) {
            adjustQualityBasedOnNetwork()
          }
        }

        connection.onchange = handleNetworkChange
      }
    }

    monitorNetworkConditions()

    // Clean up
    return () => {
      console.log("Cleaning up global handlers")
      delete window.hotspotClickHandler

      const nav = navigator as NavigatorWithConnection
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection
      if (connection) {
        connection.onchange = undefined
      }

      if (bufferCheckIntervalRef.current) {
        clearInterval(bufferCheckIntervalRef.current)
      }

      if (qualityCheckIntervalRef.current) {
        clearInterval(qualityCheckIntervalRef.current)
      }
    }
  }, [onHotspotClick])

  // Function to adjust quality based on network conditions
  const adjustQualityBasedOnNetwork = useCallback(() => {
    const nav = navigator as NavigatorWithConnection
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection

    if (connection) {
      const { downlink, effectiveType } = connection
      let newQuality = "medium"

      // Adjust quality based on connection type and speed
      if (effectiveType === "4g" && downlink > 5) {
        newQuality = "high"
      } else if (effectiveType === "4g" || (effectiveType === "3g" && downlink > 1.5)) {
        newQuality = "medium"
      } else {
        newQuality = "low"
      }

      console.log(`Auto-adjusting quality to ${newQuality} based on network: ${effectiveType}, ${downlink} Mbps`)
      return newQuality
    }

    return "medium" // Default if connection info not available
  }, [])

  // Update visible hotspots based on current time
  useEffect(() => {
    // Filter hotspots based on current time
    const filtered = hotspots.filter((hotspot) => {
      const startTime = hotspot.startTime || 0
      const endTime = hotspot.endTime || Number.POSITIVE_INFINITY
      return currentTime >= startTime && currentTime <= endTime
    })

    setVisibleHotspots(filtered)
  }, [currentTime, hotspots])

  // Set up buffer monitoring
  useEffect(() => {
    if (!videoRef.current || !isPlaying) return

    // Set up buffer monitoring interval
    const monitorBuffer = () => {
      if (!videoRef.current) return

      const video = videoRef.current

      // Check if video is buffering
      const isCurrentlyBuffering = video.readyState < 3

      if (isCurrentlyBuffering !== isBuffering) {
        setIsBuffering(isCurrentlyBuffering)
        setShowBufferingIndicator(isCurrentlyBuffering)

        // If we were buffering but now we're not, reset the recovery attempt counter
        if (!isCurrentlyBuffering && isBuffering) {
          recoveryAttemptRef.current = 0
        }

        // If we start buffering, increment stall count
        if (isCurrentlyBuffering && !isBuffering) {
          setBufferStalls((prev) => prev + 1)
        }
      }

      // Calculate buffer progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        const progress = Math.min(Math.round((bufferedEnd / duration) * 100), 100)
        setBufferProgress(progress)

        // If we have a good buffer and we're in recovery mode, exit recovery
        if (progress > 30 && isRecovering) {
          setIsRecovering(false)
        }
      }

      // Check for stalled playback
      if (isPlaying && isCurrentlyBuffering && video.currentTime === lastBufferCheck) {
        console.log("Playback appears stalled, attempting recovery")

        // Implement recovery strategies based on stall count
        if (recoveryAttemptRef.current < 3) {
          // Try to resume playback by seeking slightly forward
          const seekTarget = Math.min(video.currentTime + 0.1, video.duration - 0.5)
          video.currentTime = seekTarget
          recoveryAttemptRef.current++

          // If we're in auto quality mode and have stalled multiple times, try lowering quality
          if (selectedQuality === "auto" && bufferStalls > 2) {
            const newQuality = getNextLowerQuality()
            if (newQuality !== selectedQuality) {
              console.log(`Automatically lowering quality to ${newQuality} due to buffering issues`)
              setSelectedQuality(newQuality)
            }
          }
        } else if (recoveryAttemptRef.current < 5) {
          // More aggressive recovery: pause briefly then resume
          video.pause()
          setIsRecovering(true)
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.error("Error resuming after recovery pause:", err)
              })
            }
          }, 1500)
          recoveryAttemptRef.current++
        }
      }

      setLastBufferCheck(video.currentTime)
    }

    bufferCheckIntervalRef.current = setInterval(monitorBuffer, 1000)

    return () => {
      if (bufferCheckIntervalRef.current) {
        clearInterval(bufferCheckIntervalRef.current)
      }
    }
  }, [isPlaying, isBuffering, lastBufferCheck, bufferStalls, selectedQuality, isRecovering])

  // Helper function to get the next lower quality
  const getNextLowerQuality = () => {
    const qualityLevels = ["high", "medium", "low"]
    const currentIndex = qualityLevels.indexOf(selectedQuality)

    if (currentIndex < qualityLevels.length - 1) {
      return qualityLevels[currentIndex + 1]
    }

    return selectedQuality // Already at lowest quality
  }

  // Set up video and scene when videoUrl changes
  useEffect(() => {
    if (!videoUrl || !containerRef.current) {
      console.log("No video URL or container not ready")
      return
    }

    console.log("Setting up video with URL:", videoUrl)
    setIsLoading(true)
    setHasError(false)
    setErrorDetails("")
    setVideoAttempted(false)
    setCurrentTime(0)
    setVisibleHotspots([])
    setBufferProgress(0)
    setIsBuffering(true)
    setBufferStalls(0)
    recoveryAttemptRef.current = 0

    // Clear container
    containerRef.current.innerHTML = ""

    try {
      // Create A-Frame scene with optimized settings
      const scene = document.createElement("a-scene")
      scene.setAttribute("embedded", "")
      scene.setAttribute("vr-mode-ui", "enabled: false")
      scene.setAttribute("loading-screen", "enabled: false")
      scene.setAttribute("renderer", "antialias: false; precision: medium; colorManagement: true;")
      scene.setAttribute("background", "color: #000")
      sceneRef.current = scene

      // Create camera with optimized settings
      const camera = document.createElement("a-entity")
      camera.setAttribute("camera", "")
      camera.setAttribute("position", "0 0 0")
      camera.setAttribute("look-controls", "reverseMouseDrag: false")
      camera.setAttribute("wasd-controls", "enabled: false")
      scene.appendChild(camera)

      // Create video element with optimized settings
      const video = document.createElement("video")
      video.id = "video-" + Date.now() // Unique ID
      video.crossOrigin = "anonymous"
      video.loop = true
      video.muted = isMuted
      video.playsInline = true
      video.setAttribute("playsinline", "")
      video.preload = "auto"
      video.style.display = "none"

      // Add optimized video attributes for better streaming
      video.setAttribute("x-webkit-airplay", "allow")
      video.setAttribute("webkit-playsinline", "")

      // Set initial playback rate lower to help with initial buffering
      video.playbackRate = 0.8

      videoRef.current = video

      // Add video to document body
      document.body.appendChild(video)

      // Create assets
      const assets = document.createElement("a-assets")
      assets.appendChild(video)
      scene.appendChild(assets)

      // Create video sphere with optimized settings
      const videoSphere = document.createElement("a-videosphere")
      videoSphere.setAttribute("src", `#${video.id}`)
      videoSphere.setAttribute("rotation", "0 -90 0")
      videoSphere.setAttribute("segments-height", "36") // Reduced from default for better performance
      videoSphere.setAttribute("segments-width", "64") // Reduced from default for better performance
      scene.appendChild(videoSphere)

      // Add scene to container
      containerRef.current.appendChild(scene)

      // Set up video event listeners
      const onCanPlay = () => {
        console.log("Video can play")
        setIsLoading(false)

        // Auto-play if allowed
        if (autoPlay && !needsUserInteraction) {
          console.log("Auto-playing video")
          startVideoPlayback()
        }
      }

      const onLoadedMetadata = () => {
        if (video.duration) {
          setVideoDuration(video.duration)
          console.log("Video duration:", video.duration)
        }
      }

      const onPlaying = () => {
        console.log("Video is playing")
        setIsPlaying(true)
        setNeedsUserInteraction(false)
        setIsBuffering(false)
        setShowBufferingIndicator(false)

        // Gradually increase playback rate to normal after starting
        if (video.playbackRate < 1.0) {
          setTimeout(() => {
            if (videoRef.current && !isBuffering) {
              videoRef.current.playbackRate = 1.0
            }
          }, 3000)
        }

        // Notify parent component of user interaction
        if (onUserInteraction) {
          onUserInteraction()
        }
      }

      const onPause = () => {
        console.log("Video is paused")
        setIsPlaying(false)
      }

      const onTimeUpdate = () => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime)
        }
      }

      const onWaiting = () => {
        console.log("Video is waiting for more data")
        setIsBuffering(true)
        setShowBufferingIndicator(true)

        // Reduce playback rate when buffering starts
        if (videoRef.current && videoRef.current.playbackRate > 0.8) {
          videoRef.current.playbackRate = 0.8
        }
      }

      const onStalled = () => {
        console.log("Video has stalled")
        setIsBuffering(true)
        setShowBufferingIndicator(true)
      }

      const onProgress = () => {
        if (!video.buffered.length) return

        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration

        if (duration > 0) {
          const progress = Math.min(Math.round((bufferedEnd / duration) * 100), 100)
          setBufferProgress(progress)

          // If we have a good buffer, hide the buffering indicator
          if (progress > 15 && isBuffering) {
            setShowBufferingIndicator(false)
          }
        }
      }

      const onError = (e: Event) => {
        const videoElement = e.target as HTMLVideoElement
        console.error("Video error:", e)
        console.error("Video error code:", videoElement.error?.code)
        console.error("Video error message:", videoElement.error?.message)

        setHasError(true)
        setIsLoading(false)
        setErrorDetails(
          `Error code: ${videoElement.error?.code || "unknown"}, Message: ${videoElement.error?.message || "No details"}`,
        )
      }

      // Add event listeners
      video.addEventListener("canplay", onCanPlay)
      video.addEventListener("loadedmetadata", onLoadedMetadata)
      video.addEventListener("playing", onPlaying)
      video.addEventListener("pause", onPause)
      video.addEventListener("timeupdate", onTimeUpdate)
      video.addEventListener("waiting", onWaiting)
      video.addEventListener("stalled", onStalled)
      video.addEventListener("progress", onProgress)
      video.addEventListener("error", onError)

      // Set source and load
      video.src = videoUrl
      video.load()

      // Set up quality check interval
      if (selectedQuality === "auto") {
        qualityCheckIntervalRef.current = setInterval(() => {
          if (isBuffering && bufferStalls > 1) {
            const newQuality = getNextLowerQuality()
            if (newQuality !== selectedQuality) {
              console.log(`Auto-adjusting quality to ${newQuality} due to buffering issues`)
              setSelectedQuality(newQuality)
            }
          }
        }, 10000) // Check every 10 seconds
      }

      // Clean up
      return () => {
        console.log("Cleaning up video and scene")

        video.removeEventListener("canplay", onCanPlay)
        video.removeEventListener("loadedmetadata", onLoadedMetadata)
        video.removeEventListener("playing", onPlaying)
        video.removeEventListener("pause", onPause)
        video.removeEventListener("timeupdate", onTimeUpdate)
        video.removeEventListener("waiting", onWaiting)
        video.removeEventListener("stalled", onStalled)
        video.removeEventListener("progress", onProgress)
        video.removeEventListener("error", onError)

        video.pause()
        video.src = ""
        video.load()

        // Safely remove video from DOM
        if (document.body.contains(video)) {
          try {
            document.body.removeChild(video)
          } catch (e) {
            console.warn("Could not remove video element:", e)
          }
        }

        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Clear refs
        videoRef.current = null
        sceneRef.current = null

        // Clear intervals
        if (bufferCheckIntervalRef.current) {
          clearInterval(bufferCheckIntervalRef.current)
        }

        if (qualityCheckIntervalRef.current) {
          clearInterval(qualityCheckIntervalRef.current)
        }
      }
    } catch (error) {
      console.error("Error setting up video:", error)
      setHasError(true)
      setIsLoading(false)
      setErrorDetails(`Error setting up video: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [videoUrl, isMuted, hotspots, onHotspotClick, autoPlay, needsUserInteraction, onUserInteraction, selectedQuality])


  // Function to start video playback with proper error handling
  const startVideoPlayback = () => {
    if (!videoRef.current) {
      console.error("No video element available")
      return
    }

    console.log("Attempting to play video")

    // Start with a lower playback rate to help with initial buffering
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8
    }

    videoRef.current
      .play()
      .then(() => {
        console.log("Video playing successfully")
        setIsPlaying(true)
        setNeedsUserInteraction(false)
        setShowMutedNotice(false)

        // Notify parent component of user interaction
        if (onUserInteraction) {
          onUserInteraction()
        }
      })
      .catch((err) => {
        console.warn("Could not play with sound, trying muted:", err)

        if (videoRef.current) {
          videoRef.current.muted = true
          setIsMuted(true)

          videoRef.current
            .play()
            .then(() => {
              console.log("Video playing muted")
              setIsPlaying(true)
              setNeedsUserInteraction(false)
              setShowMutedNotice(true)

              // Notify parent component of user interaction
              if (onUserInteraction) {
                onUserInteraction()
              }
            })
            .catch((err2) => {
              console.error("Failed to play even when muted:", err2)
              setHasError(true)
              setErrorDetails(`Could not play video: ${err2.message}`)
            })
        }
      })
  }

  // Function to start video playback (user initiated)
  const startVideo = () => {
    if (!videoRef.current) return

    setVideoAttempted(true)
    startVideoPlayback()
  }

  // Function to toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return

    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)

    if (newMutedState) {
      setShowMutedNotice(true)
    } else {
      setShowMutedNotice(false)
    }
  }

  // Function to restart video
  const restartVideo = () => {
    if (!videoRef.current) return

    videoRef.current.currentTime = 0

    if (isPlaying) {
      videoRef.current.play().catch((err) => {
        console.error("Error restarting video:", err)
      })
    } else {
      startVideoPlayback()
    }
  }

  // Function to handle quality change
  const handleQualityChange = (quality: string) => {
    console.log(`Changing quality to ${quality}`)
    setSelectedQuality(quality)
    setShowQualityMenu(false)

    // If we're switching to auto, determine the best quality based on network
    if (quality === "auto") {
      const bestQuality = adjustQualityBasedOnNetwork()
      console.log(`Auto quality selected, using ${bestQuality} based on network conditions`)
    }

    // Reset buffer stall counter when manually changing quality
    setBufferStalls(0)
  }

  // Function to handle video seeking
  const handleVideoSeek = (seekTime: number) => {
    if (!videoRef.current) return

    // Clamp seek time to valid range
    const validSeekTime = Math.max(0, Math.min(seekTime, videoRef.current.duration))

    // Pause before seeking to reduce stutter
    const wasPlaying = !videoRef.current.paused
    if (wasPlaying) {
      videoRef.current.pause()
    }

    // Perform the seek
    videoRef.current.currentTime = validSeekTime

    // Resume playback after a short delay
    if (wasPlaying) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.error("Error resuming after seek:", err)
          })
        }
      }, 100)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* A-Frame container */}
      <div ref={containerRef} className="w-full h-full"></div>

      {/* Play button overlay */}
      {needsUserInteraction && !isLoading && !hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startVideo}
            className="flex items-center justify-center p-6 bg-[#97E12B] text-black rounded-full hover:bg-opacity-90 transition-colors"
          >
            <Play size={48} />
          </motion.button>
          <p className="mt-8 text-white text-lg">Click to start the 360° tour</p>
        </div>
      )}

      {/* Muted notice */}
      {showMutedNotice && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>Video is muted. Click the volume button to unmute.</span>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <LoadingSpinner />
          <p className="absolute mt-20 text-white">Loading 360° video...</p>
        </div>
      )}

      {/* Buffering indicator */}
      {showBufferingIndicator && !isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-70 rounded-lg p-4 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#97E12B] border-t-transparent rounded-full mb-2"></div>
          <p className="text-white text-sm">Buffering...</p>
          <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#97E12B] transition-all duration-300 ease-out"
              style={{ width: `${bufferProgress}%` }}
            />
          </div>
          <p className="text-white text-xs mt-1">{bufferProgress}% loaded</p>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="text-white text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-xl mb-2">Failed to load video</p>
            <p className="text-sm mb-4 text-gray-300 break-words">{errorDetails}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              {videoAttempted && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-opacity-80 transition-colors"
                  onClick={startVideo}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOM-based hotspots - Only show visible hotspots */}
      {visibleHotspots.map((hotspot) => (
        <ClickableHotspot
          key={hotspot.id}
          position={hotspot.position}
          targetSceneId={hotspot.targetSceneId}
          tooltip={hotspot.tooltip || `Go to Scene ${hotspot.targetSceneId}`}
          onHotspotClick={onHotspotClick}
        />
      ))}

      {/* Video controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2">
        {/* Volume control */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="flex items-center space-x-1 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>

        {/* Restart button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={restartVideo}
          className="flex items-center space-x-1 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition-colors"
        >
          <RefreshCw size={16} />
        </motion.button>

        {/* Quality selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition-colors"
          >
            <Settings size={16} />
            <span className="text-sm">{selectedQuality === "auto" ? "Auto" : selectedQuality}</span>
            <ChevronDown size={16} />
          </motion.button>

          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-md overflow-hidden w-32">
              <div className="py-1">
                {videoQualityOptions.map((option) => (
                  <button
                    key={option.value}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                    onClick={() => handleQualityChange(option.value)}
                  >
                    <span>{option.label}</span>
                    {selectedQuality === option.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video progress bar */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 w-3/4 max-w-3xl">
        <div className="bg-black bg-opacity-60 rounded-full h-2 overflow-hidden">
          {videoRef.current && videoRef.current.duration > 0 && (
            <>
              {/* Buffered progress */}
              <div
                className="h-full bg-gray-500 absolute"
                style={{
                  width: `${bufferProgress}%`,
                }}
              />
              {/* Playback progress */}
              <div
                className="h-full bg-[#97E12B] relative"
                style={{
                  width: `${videoRef.current ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0}%`,
                }}
              />
            </>
          )}
        </div>

        {/* Clickable progress bar overlay for seeking */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={(e) => {
            if (videoRef.current && videoRef.current.duration) {
              const rect = e.currentTarget.getBoundingClientRect()
              const pos = (e.clientX - rect.left) / rect.width
              handleVideoSeek(pos * videoRef.current.duration)
            }
          }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-70 px-4 py-2 text-white text-sm rounded-lg">
        <span>Click and drag to look around</span>
      </div>

      {/* Network quality indicator */}
      <div className="absolute top-5 right-5 z-10 bg-black bg-opacity-70 px-3 py-1 text-white text-xs rounded-lg flex items-center">
        <span>Network: {networkQuality}</span>
        <span className="ml-2">Quality: {selectedQuality}</span>
        <span className="ml-2">Buffer: {bufferProgress}%</span>
      </div>

      {/* Debug info */}
      <div className="absolute top-20 right-5 z-10 bg-black bg-opacity-70 p-2 text-white text-xs">
        <p>Video URL: {videoUrl ? "Set" : "Not set"}</p>
        <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Has Error: {hasError ? "Yes" : "No"}</p>
        <p>Is Playing: {isPlaying ? "Yes" : "No"}</p>
        <p>Is Buffering: {isBuffering ? "Yes" : "No"}</p>
        <p>Is Muted: {isMuted ? "Yes" : "No"}</p>
        <p>Current Time: {currentTime.toFixed(2)}s</p>
        <p>Duration: {videoDuration.toFixed(2)}s</p>
        <p>Buffer Progress: {bufferProgress}%</p>
        <p>Buffer Stalls: {bufferStalls}</p>
        <p>Network: {networkQuality}</p>
        <p>Quality: {selectedQuality}</p>
        <p>Total Hotspots: {hotspots.length}</p>
        <p>Visible Hotspots: {visibleHotspots.length}</p>
      </div>

      {/* Time-based hotspot debug info */}
      <div className="absolute bottom-20 left-5 z-10 bg-black bg-opacity-70 p-2 text-white text-xs">
        <p>Current Time: {currentTime.toFixed(2)}s</p>
        <p>Visible Hotspots: {visibleHotspots.length}</p>
        {visibleHotspots.map((h) => (
          <p key={h.id}>
            Hotspot {h.id} → Scene {h.targetSceneId} at ({h.position.x}%, {h.position.y}%)
          </p>
        ))}
      </div>
    </div>
  )
}

export default SimpleVideoViewer


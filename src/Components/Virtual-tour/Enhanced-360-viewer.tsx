"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { Settings, ChevronDown, Check, Move3d, Gauge, Volume2, VolumeX, Zap } from "lucide-react"
import { LoadingSpinner } from "./LoadingSpinner"
import * as THREE from "three"

// Update the Hotspot interface to include timing information
interface Hotspot {
  id: string
  position: { x: number; y: number }
  targetSceneId: number // Changed from targetTourId to targetSceneId
  icon?: string
  tooltip?: string
  startTime?: number // Time in seconds when the hotspot should appear
  endTime?: number // Time in seconds when the hotspot should disappear (optional)
}

interface Enhanced360ViewerProps {
  videoUrl: string | null
  hotspots?: Hotspot[]
  onHotspotClick: (targetSceneId: number) => void // Changed from targetTourId to targetSceneId
  onQualityChange: (quality: string) => void
  selectedQuality: string
}

// Available quality options
const videoQualityOptions = [
  { label: "4K", value: "4K" },
  { label: "1080p", value: "1080p" },
  { label: "720p", value: "720p" },
  { label: "480p", value: "480p" }, 
  { label: "360p", value: "360p" }, // Added 480p option
]

// Define a type for debug info
interface DebugInfo {
  videoCreated?: boolean
  textureCreated?: boolean
  videoSrc?: string
  sphereCreated?: boolean
  videoCanPlay?: boolean
  videoWidth?: number
  videoHeight?: number
  playError?: string
  videoError?: boolean
  errorEvent?: string
  setupError?: string
  usingDirectVideo?: boolean
  muted?: boolean
  stalled?: boolean
  waiting?: boolean
  [key: string]: unknown // Allow other properties
}

const Enhanced360Viewer: React.FC<Enhanced360ViewerProps> = ({
  videoUrl,
  hotspots = [],
  onHotspotClick,
  onQualityChange,
  selectedQuality,
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [bufferProgress, setBufferProgress] = useState(0)
  const [fps, setFps] = useState(0)
  const [showPerformance, setShowPerformance] = useState(false)
  // We'll use this in the future for auto quality adjustments
  const [, setAutoQuality] = useState(selectedQuality === "auto")
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({})
  const [isMuted, setIsMuted] = useState(false)
  const [highPerformanceMode, setHighPerformanceMode] = useState(false)
  // Add currentTime state to track video playback position
  const [currentTime, setCurrentTime] = useState(0)
  const [visibleHotspots, setVisibleHotspots] = useState<Hotspot[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const textureRef = useRef<THREE.VideoTexture | null>(null)
  const isUserInteractingRef = useRef(false)
  const onPointerDownMouseXRef = useRef(0)
  const onPointerDownMouseYRef = useRef(0)
  const lonRef = useRef(0)
  const latRef = useRef(0)
  const onPointerDownLonRef = useRef(0)
  const onPointerDownLatRef = useRef(0)
  const phiRef = useRef(0)
  const thetaRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 })
  const qualityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const videoRetryTimerRef = useRef<NodeJS.Timeout | null>(null)

  console.log("Enhanced360Viewer - videoUrl:", videoUrl)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100)
    camera.position.z = 0.01
    cameraRef.current = camera

    // Create renderer - using standard settings for reliability
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable antialiasing for better performance
      powerPreference: "high-performance",
      precision: "mediump", // Use medium precision for better performance
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit to 2x for performance
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      if (animationFrameRef.current !== null) {
        if (isUserInteractingRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        } else {
          clearTimeout(animationFrameRef.current)
        }
      }
      if (qualityCheckIntervalRef.current) {
        clearInterval(qualityCheckIntervalRef.current)
      }
      if (videoRetryTimerRef.current) {
        clearTimeout(videoRetryTimerRef.current)
      }
    }
  }, [])

  // Set up video texture when video URL changes
  useEffect(() => {
    if (!videoUrl || !sceneRef.current) {
      console.log("Missing video URL or scene")
      return
    }

    console.log("Setting up video texture for URL:", videoUrl)
    setIsLoading(true)
    setIsVideoReady(false)
    setBufferProgress(0)
    setHasError(false)

    // Clean up previous video and texture if they exist
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ""
      videoRef.current.load()
      if (document.body.contains(videoRef.current)) {
        document.body.removeChild(videoRef.current)
      }
      videoRef.current = null
    }

    if (sphereRef.current && sceneRef.current) {
      sceneRef.current.remove(sphereRef.current)
      if (sphereRef.current.geometry) sphereRef.current.geometry.dispose()
      if (sphereRef.current.material instanceof THREE.Material) sphereRef.current.material.dispose()
    }

    if (textureRef.current) {
      textureRef.current.dispose()
    }

    try {
      // Create video element
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.muted = false // Enable sound
      video.loop = true
      video.playsInline = true
      video.preload = "auto"

      // Add these optimized video attributes
      video.setAttribute("playsinline", "")
      video.setAttribute("webkit-playsinline", "")

      // Add video element to the DOM
      video.style.display = "none"
      document.body.appendChild(video)
      videoRef.current = video

      // Create sphere geometry (inside-out)
      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1)

      // Create texture
      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat
      texture.generateMipmaps = false
      textureRef.current = texture

      setDebugInfo((prev) => ({
        ...prev,
        videoCreated: true,
        textureCreated: true,
        videoSrc: video.src.substring(0, 30) + "...",
      }))

      // Create material
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      })

      // Create sphere mesh
      const sphere = new THREE.Mesh(geometry, material)
      sceneRef.current.add(sphere)
      sphereRef.current = sphere

      setDebugInfo((prev) => ({
        ...prev,
        sphereCreated: true,
      }))

      // Handle video events
      const onVideoCanPlay = () => {
        console.log("Video can play")
        setIsVideoReady(true)
        setIsLoading(false)
        setDebugInfo((prev) => ({
          ...prev,
          videoCanPlay: true,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        }))

        // Play video with retry logic
        const attemptPlay = async () => {
          try {
            await video.play()
            // Clear any existing retry timer
            if (videoRetryTimerRef.current) {
              clearTimeout(videoRetryTimerRef.current)
              videoRetryTimerRef.current = null
            }
          } catch (error) {
            console.error("Error playing video:", error)
            setDebugInfo((prev) => ({
              ...prev,
              playError: error instanceof Error ? error.message : String(error),
            }))

            // Set up retry timer
            if (videoRetryTimerRef.current) {
              clearTimeout(videoRetryTimerRef.current)
            }

            videoRetryTimerRef.current = setTimeout(async () => {
              console.log("Retrying video playback...")
              try {
                await video.play()
              } catch (retryError) {
                console.error("Retry play failed:", retryError)
              }
            }, 1000) // Retry after 1 second

            // Also try to play on user interaction
            const handleUserInteraction = async () => {
              try {
                await video.play()
                // Remove event listeners after successful play
                document.removeEventListener("click", handleUserInteraction)
                document.removeEventListener("touchstart", handleUserInteraction)
              } catch (e) {
                console.error("User interaction play failed:", e)
              }
            }

            document.addEventListener("click", handleUserInteraction)
            document.addEventListener("touchstart", handleUserInteraction)
          }
        }

        attemptPlay()
      }

      const onVideoError = (e: Event) => {
        console.error("Video error:", e)
        setHasError(true)
        setIsLoading(false)
        setDebugInfo((prev) => ({
          ...prev,
          videoError: true,
          errorEvent: e.type,
        }))
      }

      const onProgress = () => {
        if (!video.buffered.length) return

        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration

        if (duration > 0) {
          const progress = Math.round((bufferedEnd / duration) * 100)
          setBufferProgress(progress)

          if (progress > 15) {
            setIsLoading(false)
          }
        }
      }

      // Add stalled/waiting event handlers
      const onStalled = () => {
        console.log("Video stalled")
        setDebugInfo((prev) => ({
          ...prev,
          stalled: true,
        }))
      }

      const onWaiting = () => {
        console.log("Video waiting for more data")
        setDebugInfo((prev) => ({
          ...prev,
          waiting: true,
        }))
      }

      // Add this to the video event handlers section in the useEffect where you set up the video
      const onTimeUpdate = () => {
        if (videoRef.current) {
          const newTime = videoRef.current.currentTime
          setCurrentTime(newTime)

          // Update visible hotspots based on current time
          if (hotspots) {
            const visible = hotspots.filter((hotspot) => {
              const startTime = hotspot.startTime || 0
              const endTime = hotspot.endTime || Number.POSITIVE_INFINITY
              return newTime >= startTime && newTime <= endTime
            })
            setVisibleHotspots(visible)
          }

          // Clear waiting/stalled flags when playback resumes
          setDebugInfo((prev) => ({
            ...prev,
            waiting: false,
            stalled: false,
          }))
        }
      }

      video.addEventListener("canplay", onVideoCanPlay)
      video.addEventListener("error", onVideoError)
      video.addEventListener("progress", onProgress)
      video.addEventListener("timeupdate", onTimeUpdate)
      video.addEventListener("stalled", onStalled)
      video.addEventListener("waiting", onWaiting)

      // Set video source after setting up all event listeners
      video.src = videoUrl

      // Start loading the video
      video.load()

      // Start animation loop with throttling for better performance
      const animate = () => {
        if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return

         // Only update texture when video has new frame
  if (videoRef.current && videoRef.current.readyState >= 2 && textureRef.current) {
    textureRef.current.needsUpdate = true
  }

        // Update FPS counter
        fpsCounterRef.current.frames++
        updateFPS()

        // Update camera rotation based on lon/lat
        latRef.current = Math.max(-85, Math.min(85, latRef.current))
        phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current)
        thetaRef.current = THREE.MathUtils.degToRad(lonRef.current)

        const x = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current)
        const y = 500 * Math.cos(phiRef.current)
        const z = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current)

        cameraRef.current.lookAt(x, y, z)

        // Force texture update on each frame
        if (textureRef.current) {
          textureRef.current.needsUpdate = true
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current)

        // Request next frame with throttling if not interacting
        if (isUserInteractingRef.current) {
          // Full speed when user is interacting
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Lower frame rate when not interacting (about 30fps)
          animationFrameRef.current = setTimeout(() => {
            requestAnimationFrame(animate)
          }, 33) as unknown as number
        }
      }

      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate)

      // Set up automatic quality adjustment based on performance
      const setupAutoQuality = () => {
        if (qualityCheckIntervalRef.current) {
          clearInterval(qualityCheckIntervalRef.current)
        }

        qualityCheckIntervalRef.current = setInterval(() => {
          if (selectedQuality === "auto" && fps < 20 && !highPerformanceMode) {
            // If FPS is low, enable high performance mode
            setHighPerformanceMode(true)

            // Apply performance optimizations
            if (rendererRef.current) {
              rendererRef.current.setPixelRatio(1.0)
            }

            console.log("Auto-enabled high performance mode due to low FPS")
          }
        }, 5000) // Check every 5 seconds
      }

      setupAutoQuality()

      // Clean up
      return () => {
        video.removeEventListener("canplay", onVideoCanPlay)
        video.removeEventListener("error", onVideoError)
        video.removeEventListener("progress", onProgress)
        video.removeEventListener("timeupdate", onTimeUpdate)
        video.removeEventListener("stalled", onStalled)
        video.removeEventListener("waiting", onWaiting)

        // Pause and remove video
        video.pause()
        video.src = ""
        video.load()
        if (document.body.contains(video)) {
          document.body.removeChild(video)
        }

        // Dispose Three.js resources
        if (animationFrameRef.current !== null) {
          if (isUserInteractingRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          } else {
            clearTimeout(animationFrameRef.current)
          }
        }

        if (qualityCheckIntervalRef.current) {
          clearInterval(qualityCheckIntervalRef.current)
        }

        if (videoRetryTimerRef.current) {
          clearTimeout(videoRetryTimerRef.current)
        }

        if (sphereRef.current && sceneRef.current) {
          sceneRef.current.remove(sphereRef.current)
          if (sphereRef.current.geometry) sphereRef.current.geometry.dispose()
          if (sphereRef.current.material instanceof THREE.Material) sphereRef.current.material.dispose()
        }

        if (textureRef.current) {
          textureRef.current.dispose()
        }
      }
    } catch (error) {
      console.error("Error setting up 360 viewer:", error)
      setHasError(true)
      setIsLoading(false)
      setDebugInfo((prev) => ({
        ...prev,
        setupError: error instanceof Error ? error.message : String(error),
      }))
    }
  }, [videoUrl, hotspots, selectedQuality])

  // Update FPS counter
  const updateFPS = () => {
    const now = performance.now()
    const elapsed = now - fpsCounterRef.current.lastTime

    if (elapsed >= 1000) {
      setFps(Math.round((fpsCounterRef.current.frames * 1000) / elapsed))
      fpsCounterRef.current.frames = 0
      fpsCounterRef.current.lastTime = now
    }
  }

  const handleQualityChange = (quality: string) => {
    onQualityChange(quality)
    setShowQualityMenu(false)
    setAutoQuality(quality === "auto")
  }

  // Mouse and touch event handlers for 360 navigation
  const onPointerDown = (event: React.MouseEvent | React.TouchEvent) => {
    if (event.nativeEvent instanceof MouseEvent) {
      isUserInteractingRef.current = true
      onPointerDownMouseXRef.current = event.nativeEvent.clientX
      onPointerDownMouseYRef.current = event.nativeEvent.clientY
      onPointerDownLonRef.current = lonRef.current
      onPointerDownLatRef.current = latRef.current
    } else if (event.nativeEvent instanceof TouchEvent && event.nativeEvent.touches.length === 1) {
      isUserInteractingRef.current = true
      onPointerDownMouseXRef.current = event.nativeEvent.touches[0].clientX
      onPointerDownMouseYRef.current = event.nativeEvent.touches[0].clientY
      onPointerDownLonRef.current = lonRef.current
      onPointerDownLatRef.current = latRef.current
    }
  }

  // Create a simple throttle function
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }, [])

  // Use our custom throttle
  const throttledPointerMove = useCallback(
    throttle((clientX: number, clientY: number) => {
      lonRef.current = (onPointerDownMouseXRef.current - clientX) * 0.1 + onPointerDownLonRef.current
      latRef.current = (clientY - onPointerDownMouseYRef.current) * 0.1 + onPointerDownLatRef.current
    }, 5), // 5ms throttle time
    [],
  )

  const onPointerMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isUserInteractingRef.current) return

    let clientX, clientY

    if (event.nativeEvent instanceof MouseEvent) {
      clientX = event.nativeEvent.clientX
      clientY = event.nativeEvent.clientY
    } else if (event.nativeEvent instanceof TouchEvent && event.nativeEvent.touches.length === 1) {
      clientX = event.nativeEvent.touches[0].clientX
      clientY = event.nativeEvent.touches[0].clientY
    } else {
      return
    }

    throttledPointerMove(clientX, clientY)
  }

  const onPointerUp = () => {
    isUserInteractingRef.current = false
  }

  // Add this function to the component to handle video seeking
  const handleVideoSeek = useCallback((seekTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
    }
  }, [])

  // Function to try a direct video approach if Three.js fails
  const tryDirectVideoFallback = () => {
    if (!videoUrl) return

    // Remove Three.js elements
    if (rendererRef.current && containerRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement)
    }

    // Create a direct video element
    const directVideo = document.createElement("video")
    directVideo.crossOrigin = "anonymous"
    directVideo.muted = false // Change from true to false to enable sound
    directVideo.loop = true
    directVideo.playsInline = true
    directVideo.controls = true
    directVideo.style.width = "100%"
    directVideo.style.height = "100%"
    directVideo.style.objectFit = "cover"
    directVideo.src = videoUrl

    // Add to container
    if (containerRef.current) {
      containerRef.current.appendChild(directVideo)
    }

    // Play video
    directVideo.play().catch((error) => {
      console.error("Error playing direct video:", error)
    })

    setDebugInfo((prev) => ({
      ...prev,
      usingDirectVideo: true,
    }))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      {/* Debug info */}
      <div className="absolute top-20 right-5 z-50 bg-black bg-opacity-70 p-2 text-white text-xs">
        <p>Video URL: {videoUrl ? "Set" : "Not set"}</p>
        <p className="break-all">
          URL: {videoUrl ? `${videoUrl.substring(0, 30)}...${videoUrl.substring(videoUrl.length - 30)}` : "None"}
        </p>
        <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Is Video Ready: {isVideoReady ? "Yes" : "No"}</p>
        <p>Has Error: {hasError ? "Yes" : "No"}</p>
        <p>Buffer Progress: {bufferProgress}%</p>
        <p>
          Lon: {Math.round(lonRef.current)}°, Lat: {Math.round(latRef.current)}°
        </p>
        {showPerformance && <p>FPS: {fps}</p>}

        {/* Extended debug info */}
        <div className="mt-2 border-t border-gray-600 pt-2">
          <p>Debug Info:</p>
          {Object.entries(debugInfo).map(([key, value]) => (
            <p key={key}>
              {key}: {String(value)}
            </p>
          ))}
        </div>
      </div>

      {/* 360 Instructions */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-70 p-2 text-white text-sm rounded-lg flex items-center">
        <Move3d className="mr-2" size={20} />
        <span>Click and drag to look around</span>
      </div>

      {/* Performance Monitor Toggle */}
      <button
        onClick={() => setShowPerformance(!showPerformance)}
        className="absolute top-5 right-80 z-20 px-4 py-2 bg-black bg-opacity-60 text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors flex items-center"
      >
        <Gauge size={16} className="mr-2" />
        {showPerformance ? "Hide FPS" : "Show FPS"}
      </button>

      {/* Performance Mode Toggle */}
      <button
        onClick={tryDirectVideoFallback}
        className="absolute top-5 right-140 z-20 px-4 py-2 bg-red-600 text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        Try Direct Video
      </button>

      {/* Force Texture Update button */}
      <button
        onClick={() => {
          // Force texture update
          if (textureRef.current && videoRef.current) {
            console.log("Forcing texture update")
            textureRef.current.needsUpdate = true

            // Try to restart video if needed
            if (videoRef.current.paused) {
              videoRef.current.play().catch((err) => console.error("Error playing video:", err))
            }

            // Force a render
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
          }
        }}
        className="absolute top-5 right-240 z-20 px-4 py-2 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        Force Texture Update
      </button>

      <button
        onClick={() => {
          setHighPerformanceMode(!highPerformanceMode)

          // Apply performance optimizations
          if (rendererRef.current) {
            if (!highPerformanceMode) {
              // Entering high performance mode
              rendererRef.current.setPixelRatio(1.0) // Reduce to 1.0 for max performance

              // Reduce sphere geometry complexity if it exists
              if (sphereRef.current && sphereRef.current.geometry) {
                sceneRef.current?.remove(sphereRef.current)

                // Create a lower poly sphere
                const lowPolyGeometry = new THREE.SphereGeometry(500, 32, 16)
                lowPolyGeometry.scale(-1, 1, 1)

                const newSphere = new THREE.Mesh(lowPolyGeometry, sphereRef.current.material)

                sceneRef.current?.add(newSphere)
                sphereRef.current.geometry.dispose()
                sphereRef.current = newSphere
              }
            } else {
              // Exiting high performance mode
              rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
            }
          }
        }}
        className="absolute top-5 right-180 z-20 px-4 py-2 bg-black bg-opacity-60 text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors flex items-center"
      >
        <Zap size={16} className="mr-2" />
        {highPerformanceMode ? "Standard Quality" : "High Performance"}
      </button>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black"
          >
            <LoadingSpinner />
            {bufferProgress > 0 && (
              <div className="mt-4 w-64">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#97E12B] transition-all duration-300 ease-out"
                    style={{ width: `${bufferProgress}%` }}
                  />
                </div>
                <p className="text-white text-sm mt-2 text-center">Loading: {bufferProgress}%</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {hasError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center">
          <p className="text-xl mb-4">Failed to load video.</p>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-80 transition-colors"
              onClick={tryDirectVideoFallback}
            >
              Try Direct Video
            </button>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2">
        {/* Volume control button */}
        <button
          onClick={() => {
            if (videoRef.current) {
              const newMutedState = !videoRef.current.muted
              videoRef.current.muted = newMutedState
              setIsMuted(newMutedState)
              setDebugInfo((prev) => ({
                ...prev,
                muted: newMutedState,
              }))
            }
          }}
          className="flex items-center space-x-1 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Quality selector (existing code) */}
        <div className="relative">
          <button
            className="flex items-center space-x-1 px-3 py-1.5 bg-black bg-opacity-60 text-white rounded-md hover:bg-opacity-80 transition-colors"
            onClick={() => setShowQualityMenu(!showQualityMenu)}
          >
            <Settings size={16} />
            <span className="text-sm">{selectedQuality === "auto" ? "Auto" : selectedQuality}</span>
            <ChevronDown size={16} />
          </button>

          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded-md overflow-hidden w-32">
              <div className="py-1">
                <button
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                  onClick={() => handleQualityChange("auto")}
                >
                  <span>Auto</span>
                  {selectedQuality === "auto" && <Check size={16} />}
                </button>
                {videoQualityOptions.map((option) => (
                  <button
                    key={option.label}
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

      {/* Time-based Hotspots */}
      {visibleHotspots.map((hotspot) => (
        <React.Fragment key={hotspot.id}>
          <motion.div
            data-tooltip-id={`hotspot-${hotspot.id}`}
            data-tooltip-content={hotspot.tooltip || `Go to scene ${hotspot.targetSceneId}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full cursor-pointer z-10"
            style={{
              left: `${hotspot.position.x}%`,
              top: `${hotspot.position.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation() // Prevent triggering the drag
              onHotspotClick(hotspot.targetSceneId)
            }}
          >
            {hotspot.icon ? (
              <img
                src={hotspot.icon || "/placeholder.svg"}
                alt={hotspot.tooltip || `Go to scene ${hotspot.targetSceneId}`}
                className="w-full h-full object-contain rounded-full border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-[#97E12B] bg-opacity-80 rounded-full border-2 border-white" />
            )}
          </motion.div>
          <Tooltip
            id={`hotspot-${hotspot.id}`}
            place="top"
            className="z-100 text-sm py-2 px-3 bg-[#5A8E00] text-white rounded"
          />
        </React.Fragment>
      ))}

      {/* Debug info for time-based hotspots */}
      <div className="absolute bottom-20 left-5 z-50 bg-black bg-opacity-70 p-2 text-white text-xs">
        <p>Video Time: {currentTime.toFixed(2)}s</p>
        <p>Visible Hotspots: {visibleHotspots.length}</p>
        {visibleHotspots.map((h) => (
          <p key={h.id}>
            Hotspot: {h.id} (Scene {h.targetSceneId})
          </p>
        ))}
      </div>

      {/* Video buffering indicator */}
      {videoRef.current && debugInfo.waiting && !isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-black bg-opacity-70 rounded-lg p-4 flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-white">Buffering...</span>
          </div>
        </div>
      )}

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
    </div>
  )
}

export default Enhanced360Viewer


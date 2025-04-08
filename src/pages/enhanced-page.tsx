"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Maximize, Minimize, Play, Pause, Volume2, VolumeX, RefreshCw, ChevronRight } from "lucide-react"

// Define the tour data without durations
const tourData = [
  {
    id: 1,
    title: "Shere Hills",
    description: "Explore the stunning Shere Hills with its rugged terrain",
    scenes: [
      {
        id: 1,
        youtubeId: "2PLmcXGaqFw", // First video
        title: "Main Entrance",
        description: "The breathtaking entrance to Shere Hills with panoramic views of the valley.",
        hotspots: [
          {
            id: "to-scene-2",
            position: { x: 42, y: 58 }, // Position in percentages
            targetSceneId: 2,
            title: "Scenic Viewpoint",
            description: "Visit this breathtaking viewpoint overlooking the valley with panoramic views.",
            startTime: 26, // Keep user's specified start time
          },
        ],
        nextSceneId: 2, // Auto-transition to scene 2
      },
      {
        id: 2,
        youtubeId: "sgKh_UGfU0U", // Second video
        title: "Scenic Viewpoint",
        description: "A stunning viewpoint with panoramic views of the surrounding landscape.",
        hotspots: [
          {
            id: "to-scene-3",
            position: { x: 60, y: 50 }, // Position in percentages
            targetSceneId: 3,
            title: "Rock Formation",
            description: "Discover this unique rock formation created by millions of years of erosion.",
            startTime: 49, // Keep user's specified start time
          },
        ],
        nextSceneId: 3, // Auto-transition to scene 3
      },
      {
        id: 3,
        youtubeId: "T2RE6q70_nE", // Third video
        title: "Rock Formation",
        description: "Unique rock formations created by millions of years of erosion.",
        hotspots: [
          {
            id: "to-scene-4",
            position: { x: 70, y: 40 }, // Position in percentages
            targetSceneId: 4,
            title: "Hiking Trail",
            description: "Follow this trail to explore the dense forest area with diverse plant species.",
            startTime: 110, // Keep user's specified start time
          },
        ],
        nextSceneId: 4, // Auto-transition to scene 4
      },
      {
        id: 4,
        youtubeId: "H3-6U7Wrv5g", // Fourth video
        title: "Hiking Trail",
        description: "A scenic trail through the dense forest with diverse plant species.",
        hotspots: [
          {
            id: "to-scene-5",
            position: { x: 50, y: 60 }, // Position in percentages
            targetSceneId: 5,
            title: "Waterfall",
            description: "Experience the majestic waterfall cascading down the rocky cliff.",
            startTime: 120, // Keep user's specified start time
          },
        ],
        nextSceneId: 5, // Auto-transition to scene 5
      },
      {
        id: 5,
        youtubeId: "YYfX9t08U9g", // Fifth video - using your current ID
        title: "Waterfall",
        description: "A majestic waterfall cascading down the rocky cliff.",
        hotspots: [
          {
            id: "back-to-scene-1",
            position: { x: 30, y: 70 }, // Position in percentages
            targetSceneId: 1,
            title: "Return to Start",
            description: "Head back to the beginning of the tour to explore other areas.",
            startTime: 180, // Keep user's specified start time
          },
        ],
        nextSceneId: 1, // Loop back to scene 1
      },
    ],
  },
]

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string {
  if (!url) return ""
  if (!/[/.]/.test(url)) return url

  const youtubeShortRegex = /youtu\.be\/([^/?]+)/
  const shortMatch = url.match(youtubeShortRegex)
  if (shortMatch && shortMatch[1]) return shortMatch[1]

  const youtubeRegex = /youtube\.com\/(?:embed\/|watch\?v=)([^/?&]+)/
  const match = url.match(youtubeRegex)
  if (match && match[1]) return match[1]

  return url
}

interface HotspotState {
  id: string
  position: { x: number; y: number }
  targetSceneId: number
  title: string
  description: string
  startTime: number
  visible: boolean
}

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
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [playerTime, setPlayerTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [lastTimeUpdate, setLastTimeUpdate] = useState(0)

  // New interactive states
  const [showEndPrompt, setShowEndPrompt] = useState(false)
  const [endPromptType, setEndPromptType] = useState<"auto" | "manual">("auto")
  const [nearEnd, setNearEnd] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const youtubeApiLoadedRef = useRef(false)
  const youtubeAPILoadingRef = useRef(false)
  const playerInitializedRef = useRef(false)
  const transitionTimeoutRef = useRef<number | null>(null)
  const transitionAnimationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const timeUpdateIntervalRef = useRef<number | null>(null)
  const autoplayTimeoutRef = useRef<number | null>(null)
  const endPromptTimeoutRef = useRef<number | null>(null)

  // Function to apply comprehensive protection to the YouTube player
  const applyYouTubeProtection = () => {
    // Find the YouTube iframe
    const iframe = document.querySelector("#youtube-player iframe") as HTMLIFrameElement
    if (!iframe) return

    // Try to access the iframe content (may be blocked by CORS)
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        // Add style to hide controls in the iframe
        const style = document.createElement("style")
        style.textContent = `
        .ytp-chrome-top, 
        .ytp-chrome-bottom, 
        .ytp-contextmenu,
        .ytp-share-button, 
        .ytp-copylink-button {
          display: none !important;
          visibility: hidden !important;
        }
      `
        iframeDoc.head.appendChild(style)

        // Add event listener to prevent right-click
        iframeDoc.addEventListener("contextmenu", (e) => {
          e.preventDefault()
          return false
        })
      }
    } catch (e) {
      console.log("Cannot access iframe content due to same-origin policy")
    }

    // Add overlay divs to block controls and right-clicks
    const playerContainer = document.getElementById("youtube-player-container")
    if (playerContainer) {
      // Top control blocker
      const topBlocker = document.createElement("div")
      topBlocker.className = "yt-control-blocker"
      topBlocker.style.position = "absolute"
      topBlocker.style.top = "0"
      topBlocker.style.left = "0"
      topBlocker.style.right = "0"
      topBlocker.style.height = "40px"
      topBlocker.style.zIndex = "2147483647"
      topBlocker.style.background = "transparent"
      topBlocker.addEventListener("contextmenu", (e) => e.preventDefault())
      playerContainer.appendChild(topBlocker)

      // Bottom control blocker
      const bottomBlocker = document.createElement("div")
      bottomBlocker.className = "yt-bottom-control-blocker"
      bottomBlocker.style.position = "absolute"
      bottomBlocker.style.bottom = "0"
      bottomBlocker.style.left = "0"
      bottomBlocker.style.right = "0"
      bottomBlocker.style.height = "40px"
      bottomBlocker.style.zIndex = "2147483647"
      bottomBlocker.style.background = "transparent"
      bottomBlocker.addEventListener("contextmenu", (e) => e.preventDefault())
      playerContainer.appendChild(bottomBlocker)

      // Full overlay to prevent right-click
      const fullOverlay = document.createElement("div")
      fullOverlay.className = "full-player-overlay"
      fullOverlay.style.position = "absolute"
      fullOverlay.style.top = "0"
      fullOverlay.style.left = "0"
      fullOverlay.style.width = "100%"
      fullOverlay.style.height = "100%"
      fullOverlay.style.zIndex = "10"
      fullOverlay.style.background = "transparent"
      fullOverlay.style.pointerEvents = "none" // Allow clicks to pass through

      // Add event listener to prevent right-click
      fullOverlay.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        return false
      })

      playerContainer.appendChild(fullOverlay)
    }

    // Add global right-click prevention
    document.addEventListener("contextmenu", (e) => {
      const target = e.target as HTMLElement
      if (target.closest("#youtube-player-container")) {
        e.preventDefault()
        return false
      }
    })
  }

  // Find the current tour and scene
  useEffect(() => {
    const parsedTourId = Number.parseInt(tourId || "1")
    const foundTour = tourData.find((tour) => tour.id === parsedTourId) || tourData[0]
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

      // Reset player state
      setPlayerTime(0)
      lastTimeRef.current = 0
      setVideoDuration(0)
      setIsTransitioning(false)
      setTransitionProgress(0)
      setLastTimeUpdate(Date.now())
      setShowEndPrompt(false)
      setNearEnd(false)
    }
  }, [tourId, sceneId])

  // Add a useEffect to detect when the video duration is available and log it
  useEffect(() => {
    if (videoDuration > 0) {
      console.log(`Video duration detected: ${videoDuration.toFixed(1)}s for scene ${currentScene?.id}`)
    }
  }, [videoDuration, currentScene])

  // Add a useEffect to detect when we're near the end of the video
  useEffect(() => {
    if (playerTime > 0 && videoDuration > 0) {
      const timeRemaining = videoDuration - playerTime

      // Log when we're getting close to the end
      if (timeRemaining < 5) {
        console.log(`Getting close to end: ${timeRemaining.toFixed(1)}s remaining`)
      }
    }
  }, [playerTime, videoDuration])

  // Add CSS styles for YouTube player with controls hidden
  useEffect(() => {
    const styleId = "youtube-player-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.innerHTML = `
        /* Player container styles */
        #youtube-player-container {
          position: relative;
          width: 100%;
          height: 100%;
          background-color: #000;
        }
        
        #youtube-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        #youtube-player iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Hide YouTube controls */
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-youtube-button,
        .ytp-share-button,
        .ytp-watch-later-button,
        .ytp-embed-button,
        .ytp-playlist-menu-button,
        .ytp-overflow-menu-button,
        .ytp-copylink-button,
        .ytp-contextmenu,
        .ytp-settings-button,
        .ytp-fullscreen-button,
        .ytp-size-button,
        .ytp-volume-panel,
        .ytp-time-display,
        .ytp-chapter-container,
        .ytp-iv-drawer-open,
        .ytp-pause-overlay,
        .ytp-related-on-show,
        .ytp-spinner,
        .ytp-bezel,
        .ytp-paid-content-overlay,
        .ytp-player-content,
        .ytp-iv-player-content {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }

        /* Hide YouTube context menu and URL copy options */
        .ytp-contextmenu, 
        .ytp-copy-url-button, 
        .ytp-contextmenu-link,
        .ytp-copylink-button,
        .ytp-contextmenu-menu {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Prevent selection of text */
        #youtube-player-container {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }

        /* Hide right-click context menu */
        #youtube-player-container::-webkit-context-menu,
        #youtube-player iframe::-webkit-context-menu {
          display: none !important;
        }
        
        /* Animation for ping effect */
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Transition animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }

        /* Scale in animation */
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        /* Slide down animation */
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        
        /* Progress animation */
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 1.5s linear forwards;
        }
        
        /* Hotspot fade-in animation */
        @keyframes hotspotFadeIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .hotspot-fade-in {
          animation: hotspotFadeIn 0.5s ease-out forwards;
        }
        
        /* Pulse animation for buttons */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Glow animation */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(151, 225, 43, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(151, 225, 43, 0.8);
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // Load YouTube API
  useEffect(() => {
    if (!youtubeApiLoadedRef.current && !youtubeAPILoadingRef.current) {
      youtubeAPILoadingRef.current = true

      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"

      tag.onload = () => {
        youtubeApiLoadedRef.current = true
        youtubeAPILoadingRef.current = false
      }

      tag.onerror = (e) => {
        youtubeAPILoadingRef.current = false
        setError("Failed to load YouTube player. Please refresh the page.")
      }

      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }
  }, [])

  // Initialize YouTube player when scene changes
  useEffect(() => {
    // Reset player state
    setIsLoading(true)
    playerInitializedRef.current = false
    setPlayerReady(false)

    // Clear any existing intervals and timeouts
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }

    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current)
      autoplayTimeoutRef.current = null
    }

    if (endPromptTimeoutRef.current) {
      clearTimeout(endPromptTimeoutRef.current)
      endPromptTimeoutRef.current = null
    }

    if (!currentScene || !videoId) return

    // Function to initialize the player
    const initializePlayer = () => {
      // Make sure the container is ready
      if (!playerContainerRef.current) {
        setTimeout(initializePlayer, 100)
        return
      }

      // Clear previous player
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '<div id="youtube-player"></div>'
      }

      // Check if YouTube API is ready
      if (typeof window.YT === "undefined" || typeof window.YT.Player === "undefined") {
        setTimeout(initializePlayer, 200)
        return
      }

      try {
        // Create the player with a delay to ensure DOM is ready
        setTimeout(() => {
          try {
            // Create new player with controls disabled
            playerRef.current = new window.YT.Player("youtube-player", {
              videoId: videoId,
              playerVars: {
                autoplay: 1, // Enable autoplay
                controls: 0, // Disable controls
                disablekb: 1, // Disable keyboard controls
                fs: 0, // Disable fullscreen button
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3, // Hide annotations
                origin: window.location.origin,
              },
              events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError,
              },
            })

            playerInitializedRef.current = true

            // Add additional protection against right-click and context menu
            const addRightClickProtection = () => {
              // Protect the iframe from right-clicks
              const iframe = document.querySelector("#youtube-player iframe")
              if (iframe) {
                // Add event listener to the iframe if possible
                try {
                  iframe.contentWindow?.document.addEventListener("contextmenu", (e) => {
                    e.preventDefault()
                    return false
                  })
                } catch (err) {
                  // CORS might prevent this, so we'll use other methods
                }

                // Add CSS to hide context menu in iframe
                const style = document.createElement("style")
                style.textContent = `
                  .ytp-contextmenu, .ytp-copy-url-button, .ytp-contextmenu-link {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                  }
                `
                document.head.appendChild(style)

                // Add overlay to capture right-clicks
                const overlay = document.createElement("div")
                overlay.style.position = "absolute"
                overlay.style.top = "0"
                overlay.style.left = "0"
                overlay.style.width = "100%"
                overlay.style.height = "100%"
                overlay.style.zIndex = "5"
                overlay.style.background = "transparent"
                overlay.addEventListener("contextmenu", (e) => {
                  e.preventDefault()
                  return false
                })

                const playerContainer = document.getElementById("youtube-player-container")
                if (playerContainer) {
                  playerContainer.appendChild(overlay)
                }
              }
            }

            // Call this function after player initialization
            setTimeout(addRightClickProtection, 1000)
          } catch (err) {
            // Use fallback method
            loadVideoWithFallbackMethod()
          }
        }, 200)
      } catch (err) {
        // Use fallback method
        loadVideoWithFallbackMethod()
      }
    }

    // Player event handlers
    function onPlayerReady(event: any) {
      setIsLoading(false)
      setIsPlaying(true)
      setPlayerReady(true)

      try {
        // Force play video
        event.target.playVideo()

        // Try to get the duration
        try {
          const duration = event.target.getDuration()
          if (duration && duration > 0) {
            setVideoDuration(duration)
          }
        } catch (err) {
          console.error("Error getting duration:", err)
        }

        // Start a timer to check video time
        timeUpdateIntervalRef.current = window.setInterval(() => {
          if (event.target && typeof event.target.getCurrentTime === "function") {
            try {
              const currentTime = event.target.getCurrentTime()
              const duration = event.target.getDuration() || 0

              // Update time and last update timestamp
              setPlayerTime(currentTime)
              lastTimeRef.current = currentTime
              setLastTimeUpdate(Date.now())

              // Update hotspot visibility
              if (currentScene?.hotspots) {
                setHotspots((prevHotspots) =>
                  prevHotspots.map((hotspot) => {
                    const shouldBeVisible = currentTime >= hotspot.startTime
                    return {
                      ...hotspot,
                      visible: shouldBeVisible,
                    }
                  }),
                )
              }

              // Check if we're near the end of the video (2 seconds before end)
              if (duration > 0 && currentTime > 0) {
                const timeRemaining = duration - currentTime
                console.log(`Time remaining: ${timeRemaining.toFixed(1)}s, Duration: ${duration.toFixed(1)}s`)

                // If we're 2 seconds from the end and not already showing the prompt
                if (timeRemaining <= 2 && !nearEnd && !showEndPrompt) {
                  console.log("Near end of video - pausing and showing prompt")
                  setNearEnd(true)

                  // Pause the video
                  event.target.pauseVideo()
                  setIsPlaying(false)

                  // Show the end prompt
                  setEndPromptType("auto")
                  setShowEndPrompt(true)
                }
              }
            } catch (err) {
              console.error("Error getting current time:", err)
            }
          }
        }, 500)
      } catch (err) {
        console.error("Error in onPlayerReady:", err)
      }

      // Inside onPlayerReady function, add this at the end:
      const addRightClickProtection = () => {
        // Protect the iframe from right-clicks
        const iframe = document.querySelector("#youtube-player iframe")
        if (iframe) {
          // Add event listener to the iframe if possible
          try {
            iframe.contentWindow?.document.addEventListener("contextmenu", (e) => {
              e.preventDefault()
              return false
            })
          } catch (err) {
            // CORS might prevent this, so we'll use other methods
          }

          // Add CSS to hide context menu in iframe
          const style = document.createElement("style")
          style.textContent = `
            .ytp-contextmenu, .ytp-copy-url-button, .ytp-contextmenu-link {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `
          document.head.appendChild(style)

          // Add overlay to capture right-clicks
          const overlay = document.createElement("div")
          overlay.style.position = "absolute"
          overlay.style.top = "0"
          overlay.style.left = "0"
          overlay.style.width = "100%"
          overlay.style.height = "100%"
          overlay.style.zIndex = "5"
          overlay.style.background = "transparent"
          overlay.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            return false
          })

          const playerContainer = document.getElementById("youtube-player-container")
          if (playerContainer) {
            playerContainer.appendChild(overlay)
          }
        }
      }

      setTimeout(addRightClickProtection, 1000)
      setTimeout(applyYouTubeProtection, 1000)
    }

    function onPlayerStateChange(event: any) {
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
        setIsPlaying(true)
        setIsLoading(false)

        // Reset end-of-video flags when video starts playing
        setNearEnd(false)
        setShowEndPrompt(false)
      }

      // YT.PlayerState.PAUSED = 2
      if (event.data === 2) {
        setIsPlaying(false)
      }

      // YT.PlayerState.ENDED = 0
      if (event.data === 0) {
        console.log("Video ended naturally - showing prompt")
        // Video ended naturally
        setEndPromptType("auto")
        setShowEndPrompt(true)
        setNearEnd(true)
      }
    }

    function onPlayerError(event: any) {
      setError(`YouTube player error: ${event.data}`)
      setIsLoading(false)

      // Use fallback method
      loadVideoWithFallbackMethod()
    }

    // Start initialization
    initializePlayer()

    // Set a timeout to use fallback method if player doesn't initialize
    const fallbackTimeout = setTimeout(() => {
      if (!playerInitializedRef.current) {
        loadVideoWithFallbackMethod()
      }
    }, 5000)

    // Clean up
    return () => {
      clearTimeout(fallbackTimeout)

      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }

      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
        autoplayTimeoutRef.current = null
      }

      if (endPromptTimeoutRef.current) {
        clearTimeout(endPromptTimeoutRef.current)
        endPromptTimeoutRef.current = null
      }

      // Destroy player if it exists
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy()
        } catch (err) {
          console.error("Error destroying player:", err)
        }
        playerRef.current = null
      }
    }
  }, [currentScene, videoId, navigate, currentTour, isTransitioning])

  // Add global protection against keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+U (view source), Ctrl+S (save), Ctrl+C (copy), etc.
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

  // Handle transition to next scene with animation
  const handleTransition = (nextSceneId: number) => {
    console.log(`Attempting transition to scene ${nextSceneId}`)

    if (isTransitioning) {
      console.log("Already transitioning, ignoring request")
      return
    }

    if (!nextSceneId) {
      console.error("No next scene ID provided for transition")
      return
    }

    setIsTransitioning(true)
    setTransitionProgress(0)
    setShowEndPrompt(false)

    // Pause the video
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      try {
        playerRef.current.pauseVideo()
      } catch (err) {
        console.error("Error pausing video:", err)
      }
    }

    // Animate the transition progress
    const startTime = performance.now()
    const duration = 1500 // 1.5 seconds

    const animateTransition = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      setTransitionProgress(progress * 100)

      if (progress < 1) {
        transitionAnimationRef.current = requestAnimationFrame(animateTransition)
      } else {
        // Transition complete, navigate to next scene
        console.log(`Transition complete, navigating to scene ${nextSceneId}`)
        navigate(`/virtual-tour/${currentTour.id}?scene=${nextSceneId}`)

        // Reset transition state after navigation
        setTimeout(() => {
          setIsTransitioning(false)
          setTransitionProgress(0)
          setNearEnd(false)
        }, 100)
      }
    }

    transitionAnimationRef.current = requestAnimationFrame(animateTransition)
  }

  // Handle replay current scene
  const handleReplay = () => {
    setShowEndPrompt(false)
    setNearEnd(false)

    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      try {
        // Seek to beginning
        playerRef.current.seekTo(0)
        // Play the video
        playerRef.current.playVideo()
        setIsPlaying(true)
      } catch (err) {
        console.error("Error replaying video:", err)
      }
    }
  }

  // Ensure autoplay after navigation
  useEffect(() => {
    // This effect runs after navigation is complete
    if (!isTransitioning && playerRef.current && typeof playerRef.current.playVideo === "function") {
      // Set a short timeout to ensure the player is ready
      autoplayTimeoutRef.current = window.setTimeout(() => {
        try {
          playerRef.current.playVideo()
          setIsPlaying(true)
        } catch (err) {
          console.error("Error auto-playing video after transition:", err)
        }
      }, 500)
    }
  }, [isTransitioning, sceneId, playerReady])

  // Fallback method to load YouTube video directly via iframe
  const loadVideoWithFallbackMethod = () => {
    if (!videoId || !playerContainerRef.current) return

    // Clear player container
    playerContainerRef.current.innerHTML = ""

    // Create a direct iframe with parameters to hide controls and autoplay
    const iframe = document.createElement("iframe")
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`
    iframe.title = "YouTube video player"
    iframe.frameBorder = "0"
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    iframe.allowFullscreen = true

    playerContainerRef.current.appendChild(iframe)
    setIsLoading(false)
    setIsPlaying(true)

    // Add a transparent overlay to prevent interaction with YouTube controls
    const overlay = document.createElement("div")
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.zIndex = "10"
    overlay.style.background = "transparent"
    overlay.style.userSelect = "none"

    // Prevent right-click
    overlay.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      return false
    })

    // Allow click events to pass through for play/pause
    overlay.addEventListener("click", () => {
      setIsPlaying(!isPlaying)
    })

    playerContainerRef.current.appendChild(overlay)

    // Also add event listeners to the document to prevent keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Prevent Ctrl+U (view source), Ctrl+S (save), etc.
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "s" || e.key === "c")) {
        e.preventDefault()
        return false
      }
    })
  }

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

  // Add this after the useEffect that handles fullscreen change events
  useEffect(() => {
    if (playerReady) {
      // Apply protection immediately
      setTimeout(() => {
        applyYouTubeProtection()
      }, 500)

      // And then periodically to ensure it stays applied
      const protectionInterval = setInterval(() => {
        applyYouTubeProtection()
      }, 5000)

      return () => {
        clearInterval(protectionInterval)
      }
    }
  }, [playerReady])

  // Handle back button click
  const handleBackClick = () => {
    navigate("/virtual-tour")
  }

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }

    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const handleToggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
    } else {
      playerRef.current.mute()
    }

    setIsMuted(!isMuted)
  }

  // Handle hotspot click
  const handleHotspotClick = (targetSceneId: number) => {
    console.log(`Hotspot clicked for scene ${targetSceneId}`)

    // Store the target scene ID for the prompt
    const clickedHotspot = hotspots.find((h) => h.targetSceneId === targetSceneId && h.visible)

    if (clickedHotspot) {
      setEndPromptType("manual")
      setShowEndPrompt(true)

      // Pause the video if it's playing
      if (isPlaying && playerRef.current && typeof playerRef.current.pauseVideo === "function") {
        try {
          playerRef.current.pauseVideo()
          setIsPlaying(false)
        } catch (err) {
          console.error("Error pausing video:", err)
        }
      }
      // Store the target scene ID for later use
      ;(window as any).tempTargetSceneId = targetSceneId
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (transitionAnimationRef.current) {
        cancelAnimationFrame(transitionAnimationRef.current)
      }

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }

      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }

      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }

      if (endPromptTimeoutRef.current) {
        clearTimeout(endPromptTimeoutRef.current)
      }
    }
  }, [])

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

      {/* Custom player controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-[#1A2E0D]/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-4">
        <button onClick={handlePlayPause} className="text-white hover:text-[#97E12B] transition-colors">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button onClick={handleToggleMute} className="text-white hover:text-[#97E12B] transition-colors">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <button onClick={handleReplay} className="text-white hover:text-[#97E12B] transition-colors">
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Hotspots */}
      {hotspots.map((hotspot) =>
        hotspot.visible ? (
          <button
            key={hotspot.id}
            onClick={() => handleHotspotClick(hotspot.targetSceneId)}
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
        ) : null,
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
          <div className="text-white text-xl flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#97E12B]/30 border-t-[#97E12B] rounded-full animate-spin mb-4"></div>
            <div>Loading video...</div>
          </div>
        </div>
      )}

      {/* End of video prompt overlay */}
      <div className="relative z-40">
        {showEndPrompt && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center animate-fadeIn">
            <div className="bg-[#1A2E0D] rounded-xl p-6 max-w-md w-full animate-scaleIn shadow-xl">
              <div className="text-center">
                <h2 className="text-[#97E12B] text-2xl font-bold mb-2 animate-slideDown">
                  {endPromptType === "auto" ? "You've reached the end of this scene!" : "Explore a new location?"}
                </h2>

                <p className="text-white mb-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                  {endPromptType === "auto"
                    ? "Would you like to continue to the next scene or replay this one?"
                    : "Would you like to visit this new location or continue exploring the current scene?"}
                </p>

                <div
                  className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn"
                  style={{ animationDelay: "0.4s" }}
                >
                  <button
                    onClick={() =>
                      handleTransition(
                        endPromptType === "auto" ? currentScene.nextSceneId : (window as any).tempTargetSceneId,
                      )
                    }
                    className="bg-[#97E12B] text-[#1A2E0D] px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#86c728] transition-colors animate-pulse"
                  >
                    {currentScene.id === 5
                      ? "Restart All Over"
                      : endPromptType === "auto"
                        ? "Continue to Next Scene"
                        : "Go to New Location"}
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={handleReplay}
                    className="bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors"
                  >
                    {currentScene.id === 5
                      ? "Restart This Scene"
                      : endPromptType === "auto"
                        ? "Replay This Scene"
                        : "Stay Here"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
          <div className="text-white text-xl font-medium mb-8">Transitioning to next scene...</div>
          <div className="w-64 h-3 bg-[#1A2E0D] rounded-full overflow-hidden">
            <div className="h-full bg-[#97E12B] rounded-full animate-progress"></div>
          </div>
        </div>
      )}

      {/* Scene description */}
      <div className="absolute bottom-24 left-4 text-white text-sm bg-[#1A2E0D]/80 px-3 py-2 rounded-lg z-20 max-w-xs">
        <h3 className="font-medium text-[#97E12B]">{currentScene.title || `Scene ${sceneId}`}</h3>
        <p className="text-xs text-white/90">{currentScene.description || "Explore this beautiful location."}</p>
      </div>

      {/* Debug info - can be removed in production */}
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded z-20">
        Time: {playerTime.toFixed(1)}s | Scene: {currentScene.id} | Next: {currentScene.nextSceneId || "None"} |
        Hotspots: {hotspots.filter((h) => h.visible).length}/{hotspots.length} visible
      </div>
    </div>
  )
}

// Add this to your global.d.ts file or declare it here
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

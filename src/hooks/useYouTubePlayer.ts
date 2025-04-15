"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { applyYouTubeProtection, loadVideoWithFallbackMethod } from "../utils/youtube-utils"

export function useYouTubePlayer(
  videoId: string,
  currentScene: any,
  playerContainerRef: React.RefObject<HTMLDivElement>,
  isTransitioning: boolean,
) {
  // Player state
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true) // Start playing by default
  const [isMuted, setIsMuted] = useState(false)
  const [playerTime, setPlayerTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [nearEnd, setNearEnd] = useState(false)
  const [showEndPrompt, setShowEndPrompt] = useState(false)
  const [endPromptType, setEndPromptType] = useState<"auto" | "manual">("auto")
  const [availableQualities, setAvailableQualities] = useState<string[]>([
    "auto",
    "hd2160",
    "hd1440",
    "hd1080",
    "hd720",
    "large",
    "medium",
    "small",
    "tiny",
  ])
  const [currentQuality, setCurrentQuality] = useState<string>("")

  // Refs
  const playerRef = useRef<any>(null)
  const youtubeApiLoadedRef = useRef(false)
  const youtubeAPILoadingRef = useRef(false)
  const playerInitializedRef = useRef(false)
  const timeUpdateIntervalRef = useRef<number | null>(null)
  const autoplayTimeoutRef = useRef<number | null>(null)
  const endPromptTimeoutRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const endPromptShownRef = useRef(false)

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

      tag.onerror = () => {
        youtubeAPILoadingRef.current = false
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
    setNearEnd(false)
    setShowEndPrompt(false)
    endPromptShownRef.current = false

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
            // Create new player with controls disabled and autoplay ON
            playerRef.current = new window.YT.Player("youtube-player", {
              videoId: videoId,
              playerVars: {
                autoplay: 1, // Enable autoplay for good UX
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
            setTimeout(() => applyYouTubeProtection(playerRef), 1000)
          } catch {
            // Use fallback method
            loadVideoWithFallbackMethod(playerContainerRef, videoId, setIsLoading, setIsPlaying, isPlaying)
          }
        }, 200)
      } catch {
        // Use fallback method
        loadVideoWithFallbackMethod(playerContainerRef, videoId, setIsLoading, setIsPlaying, isPlaying)
      }
    }

    // Player event handlers
    function onPlayerReady(event: any) {
      setIsLoading(false)
      setPlayerReady(true)
      setIsPlaying(true)

      try {
        // Force play video
        event.target.playVideo()

        // Set the playback quality to highest available
        try {
          // Get available quality levels
          const availableQualities = event.target.getAvailableQualityLevels()
          console.log("Available quality levels:", availableQualities)

          // If YouTube returns quality levels, use them, otherwise keep our defaults
          if (availableQualities && availableQualities.length > 0) {
            setAvailableQualities(availableQualities)
          } else {
            console.log("Using default quality levels as YouTube API returned none")
          }

          // Try to set to 4K first if available
          if (availableQualities.includes("hd2160")) {
            console.log("Setting quality to 4K (2160p)")
            event.target.setPlaybackQuality("hd2160")
            setCurrentQuality("hd2160")
          }
          // Try 1440p next
          else if (availableQualities.includes("hd1440")) {
            console.log("Setting quality to 1440p")
            event.target.setPlaybackQuality("hd1440")
            setCurrentQuality("hd1440")
          }
          // Then 1080p
          else if (availableQualities.includes("hd1080")) {
            console.log("Setting quality to 1080p")
            event.target.setPlaybackQuality("hd1080")
            setCurrentQuality("hd1080")
          }
          // Set to the highest available quality if none of the above are available
          else if (availableQualities && availableQualities.length > 0) {
            const highestQuality = availableQualities[0] // First is highest
            console.log("Setting quality to:", highestQuality)
            event.target.setPlaybackQuality(highestQuality)
            setCurrentQuality(highestQuality)
          } else {
            // Default to auto if no qualities are available
            console.log("Setting quality to auto (default)")
            setCurrentQuality("auto")
          }
        } catch (err) {
          console.error("Error setting video quality:", err)
          setCurrentQuality("auto")
        }

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

              // Check if we're near the end of the video (2 seconds before end)
              if (duration > 0 && currentTime > 0) {
                const timeRemaining = duration - currentTime
                console.log(`Time remaining: ${timeRemaining.toFixed(1)}s, Duration: ${duration.toFixed(1)}s`)

                // If we're 2 seconds from the end and not already showing the prompt
                if (timeRemaining <= 2 && !nearEnd && !endPromptShownRef.current) {
                  console.log("Near end of video - pausing and showing prompt")
                  setNearEnd(true)
                  endPromptShownRef.current = true

                  // Pause the video
                  event.target.pauseVideo()
                  setIsPlaying(false)

                  // Show the end prompt immediately without loading spinner
                  setEndPromptType("auto")
                  setShowEndPrompt(true)

                  // Log to console to verify the prompt should be showing
                  console.log("END PROMPT SHOULD BE SHOWING NOW")
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
    }

    function onPlayerStateChange(event: any) {
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
        setIsPlaying(true)
        setIsLoading(false)

        // Reset end-of-video flags when video starts playing
        if (!endPromptShownRef.current) {
          setNearEnd(false)
          setShowEndPrompt(false)
        }
      }

      // YT.PlayerState.PAUSED = 2
      if (event.data === 2) {
        setIsPlaying(false)
      }

      // YT.PlayerState.ENDED = 0
      if (event.data === 0) {
        console.log("Video ended naturally - showing prompt")
        // Video ended naturally - show prompt immediately without loading
        setIsPlaying(false)
        setEndPromptType("auto")
        setShowEndPrompt(true)
        setNearEnd(true)
        setIsLoading(false)
        endPromptShownRef.current = true

        // Log to console to verify the prompt should be showing
        console.log("END PROMPT SHOULD BE SHOWING NOW (VIDEO ENDED)")
      }
    }

    function onPlayerError(event: any) {
      console.error(`YouTube player error: ${event.data}`)
      setIsLoading(false)

      // Use fallback method
      loadVideoWithFallbackMethod(playerContainerRef, videoId, setIsLoading, setIsPlaying, isPlaying)
    }

    // Start initialization
    initializePlayer()

    // Set a timeout to use fallback method if player doesn't initialize
    const fallbackTimeout = setTimeout(() => {
      if (!playerInitializedRef.current) {
        loadVideoWithFallbackMethod(playerContainerRef, videoId, setIsLoading, setIsPlaying, isPlaying)
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
  }, [currentScene, videoId, isTransitioning])

  // Player control functions
  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }

    setIsPlaying(!isPlaying)
  }

  const handleToggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
    } else {
      playerRef.current.mute()
    }

    setIsMuted(!isMuted)
  }

  const handleReplay = () => {
    setShowEndPrompt(false)
    setNearEnd(false)
    endPromptShownRef.current = false

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

  const handleQualityChange = (quality: string) => {
    if (!playerRef.current || !quality) return

    try {
      console.log(`Attempting to change quality to: ${quality}`)

      // First try the standard method
      playerRef.current.setPlaybackQuality(quality)

      // Also try setting the suggested quality as a backup approach
      if (typeof playerRef.current.setPlaybackQualityRange === "function") {
        playerRef.current.setPlaybackQualityRange(quality)
      }

      // Force quality by reloading with quality parameter if needed
      if (quality !== "auto" && quality !== "default") {
        const currentTime = playerRef.current.getCurrentTime() || 0
        const videoId = playerRef.current.getVideoData().video_id

        if (videoId) {
          // Only reload if we're changing to a specific quality (not auto)
          // and we're not already at that quality
          const currentQuality = playerRef.current.getPlaybackQuality()

          if (currentQuality !== quality) {
            console.log(`Current quality: ${currentQuality}, forcing change to: ${quality}`)

            // Store current state
            const wasPlaying = !playerRef.current.getPlayerState || playerRef.current.getPlayerState() === 1
            const wasMuted = playerRef.current.isMuted && playerRef.current.isMuted()

            // Load the video with the specified quality
            playerRef.current.loadVideoById({
              videoId: videoId,
              startSeconds: currentTime,
              suggestedQuality: quality,
            })

            // Restore state
            if (!wasPlaying) {
              setTimeout(() => playerRef.current.pauseVideo(), 100)
            }

            if (wasMuted) {
              setTimeout(() => playerRef.current.mute(), 100)
            }
          }
        }
      }

      setCurrentQuality(quality)
      console.log(`Quality changed to: ${quality}`)
    } catch (err) {
      console.error("Error changing quality:", err)
    }
  }

  return {
    playerRef,
    isLoading,
    isPlaying,
    isMuted,
    playerTime,
    videoDuration,
    playerReady,
    nearEnd,
    showEndPrompt,
    endPromptType,
    availableQualities,
    currentQuality,
    setShowEndPrompt,
    setEndPromptType,
    handlePlayPause,
    handleToggleMute,
    handleReplay,
    handleQualityChange,
  }
}

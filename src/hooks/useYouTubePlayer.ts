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
  const [bufferingProgress, setBufferingProgress] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)
  const [userSelectedQuality, setUserSelectedQuality] = useState<string | null>(null)

  // Refs
  const playerRef = useRef<any>(null)
  const youtubeApiLoadedRef = useRef(false)
  const youtubeAPILoadingRef = useRef(false)
  const playerInitializedRef = useRef(false)
  const timeUpdateIntervalRef = useRef<number | null>(null)
  const bufferCheckIntervalRef = useRef<number | null>(null)
  const autoplayTimeoutRef = useRef<number | null>(null)
  const endPromptTimeoutRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const endPromptShownRef = useRef(false)
  const seekingRef = useRef(false)
  const qualityAttemptedRef = useRef(false)
  const initialLoadCompleteRef = useRef(false)

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
    qualityAttemptedRef.current = false
    initialLoadCompleteRef.current = false
    setBufferingProgress(0)
    setIsBuffering(false)
    setUserSelectedQuality(null)

    // Clear any existing intervals and timeouts
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }

    if (bufferCheckIntervalRef.current) {
      clearInterval(bufferCheckIntervalRef.current)
      bufferCheckIntervalRef.current = null
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
                onPlaybackQualityChange: onPlaybackQualityChange,
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

    // Set initial quality with YouTube's adaptive approach
    const setInitialQuality = (player: any) => {
      try {
        // Get available quality levels
        const availableQualities = player.getAvailableQualityLevels()
        console.log("Available quality levels:", availableQualities)

        if (availableQualities && availableQualities.length > 0) {
          setAvailableQualities(availableQualities)

          // Get preferred quality
          const preferredQuality = getHighestQuality(availableQualities)

          if (preferredQuality !== "auto") {
            console.log("Setting initial quality to:", preferredQuality)

            // Set quality and let YouTube handle adaptation
            player.setPlaybackQuality(preferredQuality)
            setCurrentQuality(preferredQuality)

            // Start monitoring buffer state
            startBufferMonitoring(player)
          } else {
            setCurrentQuality("auto")
          }
        } else {
          console.log("No quality levels available, using auto")
          setCurrentQuality("auto")
        }

        qualityAttemptedRef.current = true
      } catch (err) {
        console.error("Error setting initial quality:", err)
        setCurrentQuality("auto")
      }
    }

    // Monitor buffer state
    const startBufferMonitoring = (player: any) => {
      if (bufferCheckIntervalRef.current) {
        clearInterval(bufferCheckIntervalRef.current)
      }

      bufferCheckIntervalRef.current = window.setInterval(() => {
        try {
          if (player && typeof player.getVideoLoadedFraction === "function") {
            const loadedFraction = player.getVideoLoadedFraction()
            setBufferingProgress(loadedFraction * 100)

            // Check if player is buffering
            const playerState = player.getPlayerState()
            const isCurrentlyBuffering = playerState === 3 // YT.PlayerState.BUFFERING = 3

            if (isCurrentlyBuffering !== isBuffering) {
              setIsBuffering(isCurrentlyBuffering)
            }

            // If fully loaded, we can stop checking
            if (loadedFraction >= 0.98) {
              if (bufferCheckIntervalRef.current) {
                clearInterval(bufferCheckIntervalRef.current)
                bufferCheckIntervalRef.current = null
              }
              setBufferingProgress(100)
              setIsBuffering(false)
            }
          }
        } catch (err) {
          console.error("Error checking buffer state:", err)
        }
      }, 1000)
    }

    // Player event handlers
    function onPlayerReady(event: any) {
      setIsLoading(false)
      setPlayerReady(true)
      setIsPlaying(true)

      try {
        // Force play video
        event.target.playVideo()

        // Set initial quality
        setInitialQuality(event.target)

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

    function onPlaybackQualityChange(event: any) {
      const newQuality = event.data
      console.log("YouTube quality changed to:", newQuality)

      // Update our state to match YouTube's decision
      setCurrentQuality(newQuality)

      // If this was a user selection, check if YouTube honored it
      if (userSelectedQuality && newQuality !== userSelectedQuality) {
        console.log(`YouTube adapted quality from user selection ${userSelectedQuality} to ${newQuality}`)
      }
    }

    function onPlayerStateChange(event: any) {
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
        setIsPlaying(true)
        setIsLoading(false)
        setIsBuffering(false)

        // Reset end-of-video flags when video starts playing
        if (!endPromptShownRef.current) {
          setNearEnd(false)
          setShowEndPrompt(false)
        }

        // Mark initial load as complete
        if (!initialLoadCompleteRef.current) {
          initialLoadCompleteRef.current = true

          // Get current quality after initial load
          try {
            const actualQuality = event.target.getPlaybackQuality()
            console.log("Quality after initial load:", actualQuality)
            setCurrentQuality(actualQuality)
          } catch (err) {
            console.error("Error getting quality after initial load:", err)
          }
        }
      }

      // YT.PlayerState.PAUSED = 2
      if (event.data === 2) {
        setIsPlaying(false)
      }

      // YT.PlayerState.BUFFERING = 3
      if (event.data === 3) {
        setIsBuffering(true)

        // Start monitoring buffer progress
        startBufferMonitoring(event.target)
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
        setIsBuffering(false)
        endPromptShownRef.current = true

        // Log to console to verify the prompt should be showing
        console.log("END PROMPT SHOULD BE SHOWING NOW (VIDEO ENDED)")
      }
    }

    function onPlayerError(event: any) {
      console.error(`YouTube player error: ${event.data}`)
      setIsLoading(false)
      setIsBuffering(false)

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

      if (bufferCheckIntervalRef.current) {
        clearInterval(bufferCheckIntervalRef.current)
        bufferCheckIntervalRef.current = null
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

  // Add this helper function to get the highest available quality (now prioritizing 4K)
  function getHighestQuality(qualities: string[]) {
    const preferredOrder = ["hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"]
    for (const q of preferredOrder) {
      if (qualities.includes(q)) return q
    }
    return "auto"
  }

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
      console.log(`Manually changing quality to: ${quality}`)

      // Store user selection
      setUserSelectedQuality(quality)

      // Set quality and let YouTube handle adaptation
      playerRef.current.setPlaybackQuality(quality)
      setCurrentQuality(quality)

      // Start monitoring buffer state
      startBufferMonitoring(playerRef.current)

      // Show buffering indicator
      setIsBuffering(true)
    } catch (err) {
      console.error("Error changing quality:", err)
    }
  }

  // Helper function to monitor buffer state
  const startBufferMonitoring = (player: any) => {
    if (bufferCheckIntervalRef.current) {
      clearInterval(bufferCheckIntervalRef.current)
    }

    bufferCheckIntervalRef.current = window.setInterval(() => {
      try {
        if (player && typeof player.getVideoLoadedFraction === "function") {
          const loadedFraction = player.getVideoLoadedFraction()
          setBufferingProgress(loadedFraction * 100)

          // Check if player is buffering
          const playerState = player.getPlayerState()
          const isCurrentlyBuffering = playerState === 3 // YT.PlayerState.BUFFERING = 3

          if (isCurrentlyBuffering !== isBuffering) {
            setIsBuffering(isCurrentlyBuffering)
          }

          // If fully loaded, we can stop checking
          if (loadedFraction >= 0.98) {
            if (bufferCheckIntervalRef.current) {
              clearInterval(bufferCheckIntervalRef.current)
              bufferCheckIntervalRef.current = null
            }
            setBufferingProgress(100)
            setIsBuffering(false)
          }
        }
      } catch (err) {
        console.error("Error checking buffer state:", err)
      }
    }, 1000)
  }

  /**
   * Seek to a specific time in the video
   * @param time Time in seconds to seek to
   */
  const seekTo = (time: number) => {
    if (!playerRef.current || isTransitioning || !playerReady) return

    try {
      console.log(`Seeking to ${time.toFixed(2)} seconds`)

      // Mark that we're seeking to prevent end prompt from showing during seek
      seekingRef.current = true

      // Reset end-of-video flags if seeking away from the end
      if (time < videoDuration - 3) {
        setNearEnd(false)
        setShowEndPrompt(false)
        endPromptShownRef.current = false
      }

      // Seek to the specified time
      playerRef.current.seekTo(time, true)

      // Update the player time state immediately for a more responsive UI
      setPlayerTime(time)

      // If the video was paused, resume playback
      if (!isPlaying) {
        playerRef.current.playVideo()
        setIsPlaying(true)
      }

      // Show buffering indicator
      setIsBuffering(true)
      startBufferMonitoring(playerRef.current)

      // Clear seeking flag after a short delay
      setTimeout(() => {
        seekingRef.current = false
      }, 500)
    } catch (err) {
      console.error("Error seeking to time:", err)
      seekingRef.current = false
    }
  }

  /**
   * Skip forward 10 seconds in the video
   */
  const skipForward = () => {
    if (!playerRef.current || isTransitioning || !playerReady) return

    try {
      const currentTime = playerRef.current.getCurrentTime() || 0
      const duration = videoDuration || playerRef.current.getDuration() || 0

      // Calculate new time, ensuring we don't go past the end
      const newTime = Math.min(currentTime + 10, duration - 0.1)

      // Use the seekTo function to handle the actual seeking
      seekTo(newTime)
    } catch (err) {
      console.error("Error skipping forward:", err)
    }
  }

  /**
   * Skip backward 10 seconds in the video
   */
  const skipBackward = () => {
    if (!playerRef.current || isTransitioning || !playerReady) return

    try {
      const currentTime = playerRef.current.getCurrentTime() || 0

      // Calculate new time, ensuring we don't go before the start
      const newTime = Math.max(currentTime - 10, 0)

      // Use the seekTo function to handle the actual seeking
      seekTo(newTime)
    } catch (err) {
      console.error("Error skipping backward:", err)
    }
  }

  /**
   * Get the current video duration in seconds
   */
  const getDuration = () => {
    if (!playerRef.current || !playerReady) return videoDuration || 0

    try {
      const duration = playerRef.current.getDuration() || 0
      return duration > 0 ? duration : videoDuration
    } catch (err) {
      console.error("Error getting duration:", err)
      return videoDuration || 0
    }
  }

  return {
    playerRef,
    isLoading,
    isPlaying,
    isMuted,
    playerTime,
    playerDuration: videoDuration, // Expose duration as playerDuration for consistency
    playerReady,
    nearEnd,
    showEndPrompt,
    endPromptType,
    availableQualities,
    currentQuality,
    bufferingProgress,
    isBuffering,
    setShowEndPrompt,
    setEndPromptType,
    handlePlayPause,
    handleToggleMute,
    handleReplay,
    handleQualityChange,
    // New functions for playback controls
    seekTo,
    skipForward,
    skipBackward,
    getDuration,
  }
}

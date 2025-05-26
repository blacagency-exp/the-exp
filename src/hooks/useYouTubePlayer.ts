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
  const seekingRef = useRef(false)
  const qualityForceAppliedRef = useRef(false)

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
    qualityForceAppliedRef.current = false

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

    // Helper function to force quality using loadVideoById with more aggressive approach
    const forceQualityWithReload = (player: any, targetQuality: string) => {
      try {
        console.log("Force reloading video with quality:", targetQuality)

        // Get current state
        const currentTime = player.getCurrentTime() || 0
        const wasPlaying = player.getPlayerState() === 1
        const wasMuted = player.isMuted()

        // First, try to set quality directly
        player.setPlaybackQuality(targetQuality)

        // Then reload video with specific quality and additional parameters
        player.loadVideoById({
          videoId: videoId,
          startSeconds: currentTime,
          suggestedQuality: targetQuality,
        })

        // Restore state after a short delay
        setTimeout(() => {
          if (wasMuted) {
            player.mute()
          }

          // Force quality again after reload
          player.setPlaybackQuality(targetQuality)

          if (wasPlaying) {
            player.playVideo()
          }

          // Verify and force quality multiple times
          let qualityCheckAttempts = 0
          const maxQualityChecks = 5

          const checkAndForceQuality = () => {
            qualityCheckAttempts++
            const actualQuality = player.getPlaybackQuality()
            console.log(`Quality check ${qualityCheckAttempts}: ${actualQuality} (target: ${targetQuality})`)

            if (actualQuality !== targetQuality && qualityCheckAttempts < maxQualityChecks) {
              console.log(`Forcing quality again (attempt ${qualityCheckAttempts})`)
              player.setPlaybackQuality(targetQuality)
              setTimeout(checkAndForceQuality, 1000)
            } else {
              console.log("Final quality:", actualQuality)
              setCurrentQuality(actualQuality)
            }
          }

          setTimeout(checkAndForceQuality, 1000)
        }, 500)
      } catch (err) {
        console.error("Error force reloading with quality:", err)
      }
    }

    // Helper function to set quality with retry mechanism
    const setQualityWithRetry = (player: any, retryCount = 0) => {
      const maxRetries = 3 // Reduced retries but more aggressive
      const retryDelay = 2000 // Increased delay

      try {
        // Get available quality levels
        const availableQualities = player.getAvailableQualityLevels()
        console.log(`Quality attempt ${retryCount + 1}: Available quality levels:`, availableQualities)

        // If we got quality levels, use them
        if (availableQualities && availableQualities.length > 0) {
          setAvailableQualities(availableQualities)

          // Set to 4K priority quality
          const preferredQuality = getHighestQuality(availableQualities)
          if (preferredQuality !== "auto") {
            console.log("Setting quality to:", preferredQuality)

            // Use force reload method immediately for better results
            if (!qualityForceAppliedRef.current) {
              qualityForceAppliedRef.current = true
              forceQualityWithReload(player, preferredQuality)
            } else {
              // Standard method as fallback
              player.setPlaybackQuality(preferredQuality)
              setCurrentQuality(preferredQuality)
            }
          } else {
            setCurrentQuality("auto")
          }
        } else if (retryCount < maxRetries) {
          // Retry if no qualities found and we haven't exceeded max retries
          console.log(`No qualities found, retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`)
          setTimeout(() => setQualityWithRetry(player, retryCount + 1), retryDelay)
        } else {
          console.log("Max retries reached, forcing 4K anyway")
          // Force set to 4K even if we can't detect available qualities
          try {
            console.log("Attempting to force 4K quality without detection")
            forceQualityWithReload(player, "hd2160")
          } catch (err) {
            console.error("Error forcing 4K quality:", err)
            setCurrentQuality("auto")
          }
        }
      } catch (err) {
        console.error("Error in setQualityWithRetry:", err)
        if (retryCount < maxRetries) {
          setTimeout(() => setQualityWithRetry(player, retryCount + 1), retryDelay)
        } else {
          setCurrentQuality("auto")
        }
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

        // Set the playback quality with retry mechanism
        setQualityWithRetry(event.target)

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

        // Try to set quality again when video starts playing (sometimes this works better)
        if (playerRef.current && !qualityForceAppliedRef.current) {
          setTimeout(() => {
            try {
              const availableQualities = playerRef.current.getAvailableQualityLevels()
              if (availableQualities && availableQualities.length > 0) {
                const preferredQuality = getHighestQuality(availableQualities)
                const currentQuality = playerRef.current.getPlaybackQuality()
                if (currentQuality !== preferredQuality && preferredQuality !== "auto") {
                  console.log("Setting quality during playback:", preferredQuality)

                  // Use force reload method for better quality application
                  qualityForceAppliedRef.current = true
                  forceQualityWithReload(playerRef.current, preferredQuality)
                }
              }
            } catch (err) {
              console.error("Error setting quality during playback:", err)
            }
          }, 3000)
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

  // Add this helper function to get the highest available quality (now prioritizing 4K)
  function getHighestQuality(qualities: string[]) {
    const preferredOrder = ["hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"]
    for (const q of preferredOrder) {
      if (qualities.includes(q)) return q
    }
    return "auto"
  }

  // --- Enhanced quality polling with force reload capability ---
  useEffect(() => {
    let qualityInterval: number | null = null
    if (playerRef.current && playerReady && availableQualities.length > 0) {
      const highestQuality = getHighestQuality(availableQualities)
      qualityInterval = window.setInterval(() => {
        try {
          const currentQ = playerRef.current.getPlaybackQuality()
          console.log(`Quality check: current=${currentQ}, target=${highestQuality}`)

          if (currentQ !== highestQuality && highestQuality !== "auto") {
            console.log("Detected quality downgrade, force reloading with:", highestQuality)

            // Use force reload instead of just setPlaybackQuality
            const currentTime = playerRef.current.getCurrentTime() || 0
            const wasPlaying = playerRef.current.getPlayerState() === 1
            const wasMuted = playerRef.current.isMuted()

            // More aggressive reload
            playerRef.current.setPlaybackQuality(highestQuality)

            setTimeout(() => {
              playerRef.current.loadVideoById({
                videoId: videoId,
                startSeconds: currentTime,
                suggestedQuality: highestQuality,
              })

              setTimeout(() => {
                if (wasMuted) playerRef.current.mute()
                playerRef.current.setPlaybackQuality(highestQuality)
                if (wasPlaying) playerRef.current.playVideo()
                setCurrentQuality(highestQuality)
              }, 500)
            }, 100)
          }
        } catch (err) {
          console.error("Error in quality polling:", err)
        }
      }, 3000) // Check every 3 seconds
    }
    return () => {
      if (qualityInterval) clearInterval(qualityInterval)
    }
  }, [playerReady, availableQualities, videoId])

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

      // Use force reload method for manual quality changes
      const currentTime = playerRef.current.getCurrentTime() || 0
      const wasPlaying = playerRef.current.getPlayerState() === 1
      const wasMuted = playerRef.current.isMuted()

      playerRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: currentTime,
        suggestedQuality: quality,
      })

      setTimeout(() => {
        if (wasMuted) playerRef.current.mute()
        if (wasPlaying) playerRef.current.playVideo()
        setCurrentQuality(quality)
        console.log(`Quality manually changed to: ${quality}`)
      }, 500)
    } catch (err) {
      console.error("Error changing quality:", err)
    }
  }

  // NEW FUNCTIONS FOR PLAYBACK CONTROLS

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

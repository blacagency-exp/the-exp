import type React from "react"
// Helper function to extract YouTube video ID
export function extractYouTubeId(url: string): string {
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

// Function to apply comprehensive protection to the YouTube player
export function applyYouTubeProtection(playerRef: React.MutableRefObject<any>) {
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
  } catch {
    console.log("Cannot access iframe content due to same-origin policy")
  }

  // Create a full-page overlay to capture all right-clicks
  const playerContainer = document.getElementById("youtube-player-container")
  if (playerContainer) {
    // Remove any existing overlays first
    const existingOverlays = playerContainer.querySelectorAll(".right-click-blocker")
    existingOverlays.forEach((overlay) => overlay.remove())

    // Create a new overlay
    const overlay = document.createElement("div")
    overlay.className = "right-click-blocker"
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.zIndex = "100"
    overlay.style.background = "transparent"

    // This is critical - we need to allow pointer events for the overlay
    overlay.style.pointerEvents = "all"

    // Prevent right-click
    overlay.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    })

    // Allow click events to pass through for play/pause
    overlay.addEventListener("click", () => {
      if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
        try {
          const state = playerRef.current.getPlayerState()
          if (state === 1) {
            // Playing
            playerRef.current.pauseVideo()
          } else {
            playerRef.current.playVideo()
          }
        } catch {
          console.error("Error toggling play state")
        }
      }
    })

    playerContainer.appendChild(overlay)
  }

  // Add global right-click prevention for the entire document
  document.addEventListener(
    "contextmenu",
    (e) => {
      if (e.target && (e.target as HTMLElement).closest("#youtube-player-container")) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    true,
  )
}

// Add a helper function to convert quality code to readable text
export function getQualityLabel(quality: string): string {
  if (!quality) return "Auto"

  switch (quality) {
    case "hd2160":
    case "2160p":
    case "4k":
      return "4K"
    case "hd1440":
    case "1440p":
      return "1440p"
    case "hd1080":
    case "1080p":
      return "1080p"
    case "hd720":
    case "720p":
      return "720p"
    case "large":
    case "480p":
      return "480p"
    case "medium":
    case "360p":
      return "360p"
    case "small":
    case "240p":
      return "240p"
    case "tiny":
    case "144p":
      return "144p"
    case "highres":
      return "Maximum"
    case "auto":
    case "default":
      return "Auto"
    default:
      return quality.includes("p") ? quality : `${quality}p`
  }
}

// Function to load video with direct iframe approach
export function loadVideoWithFallbackMethod(
  playerContainerRef: React.RefObject<HTMLDivElement>,
  videoId: string,
  setIsLoading: (loading: boolean) => void,
  setIsPlaying: (playing: boolean) => void,
) {
  if (!videoId || !playerContainerRef.current) return

  // Clear player container
  playerContainerRef.current.innerHTML = ""

  // Create a direct iframe with parameters to hide controls and autoplay
  const iframe = document.createElement("iframe")
  iframe.width = "100%"
  iframe.height = "100%"
  // Add quality parameter to the URL and enable autoplay
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&vq=hd2160`
  iframe.title = "YouTube video player"
  iframe.frameBorder = "0"
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  iframe.allowFullscreen = true

  playerContainerRef.current.appendChild(iframe)
  setIsLoading(false)
  setIsPlaying(true) // Start playing

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
    setIsPlaying((prev: boolean) => !prev)
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

// Add a function to force quality change via iframe parameters
export function forceQualityViaIframe(
  playerContainerRef: React.RefObject<HTMLDivElement>,
  videoId: string,
  quality: string,
  currentTime: number,
  isPlaying: boolean,
  isMuted: boolean,
  onReady: () => void,
) {
  if (!playerContainerRef.current || !videoId) return

  // Map quality to YouTube's vq parameter
  let vqValue = "auto"
  switch (quality) {
    case "hd2160":
      vqValue = "hd2160"
      break
    case "hd1440":
      vqValue = "hd1440"
      break
    case "hd1080":
      vqValue = "hd1080"
      break
    case "hd720":
      vqValue = "hd720"
      break
    case "large":
      vqValue = "large"
      break
    case "medium":
      vqValue = "medium"
      break
    case "small":
      vqValue = "small"
      break
    case "tiny":
      vqValue = "tiny"
      break
    default:
      vqValue = "auto"
  }

  // Clear player container
  playerContainerRef.current.innerHTML = ""

  // Create a direct iframe with quality parameter
  const iframe = document.createElement("iframe")
  iframe.width = "100%"
  iframe.height = "100%"
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${Math.floor(currentTime)}&vq=${vqValue}`
  iframe.title = "YouTube video player"
  iframe.frameBorder = "0"
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  iframe.allowFullscreen = true

  playerContainerRef.current.appendChild(iframe)

  // Add a transparent overlay to prevent interaction with YouTube controls
  const overlay = document.createElement("div")
  overlay.style.position = "absolute"
  overlay.style.top = "0"
  overlay.style.left = "0"
  overlay.style.width = "100%"
  overlay.style.height = "100%"
  overlay.style.zIndex = "10"
  overlay.style.background = "transparent"

  playerContainerRef.current.appendChild(overlay)

  // Call the ready callback
  setTimeout(onReady, 500)
}

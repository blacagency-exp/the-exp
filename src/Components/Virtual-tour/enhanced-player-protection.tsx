"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface EnhancedPlayerProtectionProps {
  playerRef: React.MutableRefObject<any>
  isPlaying: boolean
  onPlayPause: () => void
}

export function EnhancedPlayerProtection({ playerRef, isPlaying, onPlayPause }: EnhancedPlayerProtectionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const lastMousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Prevent right-click on the player
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent keyboard shortcuts that might be used to access video info
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+U (view source), Ctrl+S (save), etc.
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "s" || e.key === "c")) {
        e.preventDefault()
        return false
      }
    }

    // Add event listeners
    const playerContainer = document.getElementById("youtube-player-container")
    if (playerContainer) {
      playerContainer.addEventListener("contextmenu", handleContextMenu)
      document.addEventListener("keydown", handleKeyDown)
    }

    // Apply CSS to hide YouTube controls and sharing options
    const style = document.createElement("style")
    style.innerHTML = `
    /* Hide ALL YouTube controls completely */
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

    /* Hide right-click context menu */
    #youtube-player-container::-webkit-context-menu,
    #youtube-player iframe::-webkit-context-menu {
      display: none !important;
    }

    /* Make sure the iframe doesn't receive pointer events for UI elements */
    #youtube-player iframe {
      pointer-events: auto !important; /* Allow 360 navigation */
    }
    
    /* Add a transparent overlay to block interaction with YouTube controls */
    .yt-control-blocker {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px; /* Block the top controls area */
      z-index: 2147483647; /* Maximum z-index */
      background: transparent;
      pointer-events: auto !important;
    }
  `
    document.head.appendChild(style)

    // Add a transparent overlay to block the top controls
    const topControlBlocker = document.createElement("div")
    topControlBlocker.className = "yt-control-blocker"

    // Add it to the player container
    setTimeout(() => {
      const playerElement = document.getElementById("youtube-player")
      if (playerElement) {
        playerElement.appendChild(topControlBlocker)
      }
    }, 1000) // Delay to ensure the player is loaded

    // Clean up
    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener("contextmenu", handleContextMenu)
      }
      document.removeEventListener("keydown", handleKeyDown)
      document.head.removeChild(style)

      const blocker = document.querySelector(".yt-control-blocker")
      if (blocker) {
        blocker.parentNode?.removeChild(blocker)
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
      } else {
        playerRef.current.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  // Handle mouse down for 360 navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left mouse button (button 0)
    if (e.button === 0) {
      setIsDragging(true)
      lastMousePosition.current = { x: e.clientX, y: e.clientY }

      // Prevent default to avoid text selection
      e.preventDefault()
    }
  }

  // Handle mouse move for 360 navigation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    // Calculate movement delta
    const deltaX = e.clientX - lastMousePosition.current.x
    const deltaY = e.clientY - lastMousePosition.current.y

    // Update last position
    lastMousePosition.current = { x: e.clientX, y: e.clientY }

    // Allow the iframe to handle the actual 360 navigation
    // We're not blocking pointer events on the iframe anymore
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle mouse leave to end dragging
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  return (
    <>
      {/* Protection overlay that allows 360 navigation but blocks right-click */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        onContextMenu={(e) => {
          e.preventDefault()
          return false
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          // Only trigger play/pause on click if we're not dragging
          if (!isDragging) {
            onPlayPause()
          }
          // Reset dragging state
          setIsDragging(false)
        }}
        style={{
          // Important: Make the overlay transparent to mouse events
          // This allows the 360 navigation to work
          pointerEvents: "none",
        }}
      />

      {/* Custom player controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-[#1A2E0D]/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-4 custom-player-controls">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlayPause()
          }}
          className="text-white hover:text-[#97E12B] transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{ pointerEvents: "auto" }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
          }}
          className="text-white hover:text-[#97E12B] transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
          style={{ pointerEvents: "auto" }}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
    </>
  )
}

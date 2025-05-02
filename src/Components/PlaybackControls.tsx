"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Rewind, FastForward, Clock } from "lucide-react"

interface PlaybackControlsProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  onForward: () => void
  onRewind: () => void
}

export default function PlaybackControls({
  currentTime,
  duration,
  onSeek,
  onForward,
  onRewind,
}: PlaybackControlsProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [seekTime, setSeekTime] = useState(currentTime)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Update seek time when current time changes (if not dragging)
  useEffect(() => {
    if (!isDragging) {
      setSeekTime(currentTime)
    }
  }, [currentTime, isDragging])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (seekTime / duration) * 100 : 0

  // Handle click on progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      const newTime = clickPosition * duration
      setSeekTime(newTime)
      onSeek(newTime)
    }
  }

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging) {
      onSeek(seekTime)
      setIsDragging(false)
    }
  }

  // Handle mouse move during drag
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const movePosition = (e.clientX - rect.left) / rect.width
      const newTime = Math.max(0, Math.min(movePosition * duration, duration))
      setSeekTime(newTime)
    }
  }

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const movePosition = (touch.clientX - rect.left) / rect.width
      const newTime = Math.max(0, Math.min(movePosition * duration, duration))
      setSeekTime(newTime)
    }
  }

  return (
    <div className="w-full px-4 pb-0 pt-0">
      <div className="max-w-4xl mx-auto">
        {/* Time display */}
        <div className="flex justify-between text-white text-sm mb-1">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatTime(seekTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          ref={progressBarRef}
          className="h-1.5 bg-white/15 rounded-full cursor-pointer relative mb-3"
          onClick={handleProgressBarClick}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onMouseMove={handleMouseMove}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onTouchMove={handleTouchMove}
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#97E12B] rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <div
            className="absolute top-0 h-3 w-3 bg-white/90 rounded-full shadow-md -mt-[3px] transform -translate-y-[1px] transition-opacity"
            style={{
              left: `calc(${progressPercentage}% - 6px)`,
              opacity: isDragging ? "1" : "0.8",
            }}
          ></div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-center gap-8 mb-2">
          <button
            onClick={onRewind}
            className="text-white hover:text-[#97E12B] transition-colors p-2"
            aria-label="Rewind 10 seconds"
          >
            <div className="flex items-center">
              <Rewind size={20} />
              <span className="ml-1 text-sm">10s</span>
            </div>
          </button>
          <button
            onClick={onForward}
            className="text-white hover:text-[#97E12B] transition-colors p-2"
            aria-label="Forward 10 seconds"
          >
            <div className="flex items-center">
              <span className="mr-1 text-sm">10s</span>
              <FastForward size={20} />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

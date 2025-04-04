"use client"

// Custom hook to monitor video buffering progress
import { useState, useEffect, useRef } from "react"

interface BufferProgress {
  loaded: number
  total: number
  percent: number
  isBuffering: boolean
}

export const useVideoBuffer = (videoUrl: string | null): BufferProgress => {
  const [bufferProgress, setBufferProgress] = useState<BufferProgress>({
    loaded: 0,
    total: 0,
    percent: 0,
    isBuffering: true,
  })

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoUrl) {
      setBufferProgress({
        loaded: 0,
        total: 0,
        percent: 0,
        isBuffering: true,
      })
      return
    }

    // Create a video element to monitor buffering
    const video = document.createElement("video")
    videoRef.current = video

    // Set up event listeners
    const onProgress = () => {
      if (!video.buffered.length) return

      const bufferedEnd = video.buffered.end(video.buffered.length - 1)
      const duration = video.duration

      // Calculate buffer progress
      const loaded = bufferedEnd
      const total = duration
      const percent = Math.round((loaded / total) * 100)

      setBufferProgress({
        loaded,
        total,
        percent,
        isBuffering: percent < 15, // Consider buffering until we have at least 15%
      })
    }

    const onCanPlay = () => {
      setBufferProgress((prev) => ({
        ...prev,
        isBuffering: false,
      }))
    }

    const onWaiting = () => {
      setBufferProgress((prev) => ({
        ...prev,
        isBuffering: true,
      }))
    }

    // Add event listeners
    video.addEventListener("progress", onProgress)
    video.addEventListener("canplay", onCanPlay)
    video.addEventListener("waiting", onWaiting)

    // Start loading the video
    video.src = videoUrl
    video.load()

    // Clean up
    return () => {
      video.removeEventListener("progress", onProgress)
      video.removeEventListener("canplay", onCanPlay)
      video.removeEventListener("waiting", onWaiting)
      video.src = ""
      video.load()
    }
  }, [videoUrl])

  return bufferProgress
}


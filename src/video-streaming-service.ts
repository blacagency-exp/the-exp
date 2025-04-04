// Service for handling video streaming and optimization
import { getSignedVideoUrl } from "./aws-s3-service"

// Define the NetworkInformation interface
interface NetworkInformation {
  downlink: number
  effectiveType: string
  rtt?: number
  saveData: boolean
  onchange?: () => void
}

// Extend Navigator interface to include connection properties
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

// Interface for video quality options
interface VideoQualityOption {
  label: string
  width: number
  height: number
  bitrate: string
}

// Available quality options
export const videoQualityOptions: VideoQualityOption[] = [
  { label: "4K", width: 3840, height: 2160, bitrate: "high" },
  { label: "1080p", width: 1920, height: 1080, bitrate: "medium" },
  { label: "720p", width: 1280, height: 720, bitrate: "low" },
  { label: "480p", width: 854, height: 480, bitrate: "lowest" },
]

// Get the appropriate video URL based on network conditions and quality preference
export const getOptimizedVideoUrl = async (videoKey: string, preferredQuality = "auto"): Promise<string> => {
  // If auto, determine quality based on network conditions
  if (preferredQuality === "auto") {
    const nav = navigator as NavigatorWithConnection
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection

    if (connection) {
      const { downlink, effectiveType } = connection

      // Adjust quality based on connection speed
      if (effectiveType === "4g" && downlink > 5) {
        preferredQuality = "1080p"
      } else if (effectiveType === "4g" || (effectiveType === "3g" && downlink > 1.5)) {
        preferredQuality = "720p"
      } else {
        preferredQuality = "480p"
      }
    } else {
      // Default to 720p if connection info is not available
      preferredQuality = "720p"
    }
  }

  // Construct the appropriate key for the requested quality
  // Assuming your S3 structure is like: tours/video-name/quality/file.mp4
  const basePath = videoKey.split("/").slice(0, -1).join("/")
  const fileName = videoKey.split("/").pop() || ""
  const qualityPath = `${basePath}/${preferredQuality}/${fileName}`

  try {
    // Get signed URL for the video at the selected quality
    return await getSignedVideoUrl(qualityPath)
  } catch (error) {
    console.error(`Failed to get optimized video URL for ${qualityPath}`, error)
    // Fallback to original video if optimized version is not available
    return await getSignedVideoUrl(videoKey)
  }
}

// Preload the next video in the tour sequence
export const preloadNextVideo = (videoKey: string): void => {
  getSignedVideoUrl(videoKey)
    .then((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "video"
      link.href = url
      document.head.appendChild(link)
    })
    .catch((error) => {
      console.error("Error preloading video:", error)
    })
}


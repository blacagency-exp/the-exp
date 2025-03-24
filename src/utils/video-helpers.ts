import * as THREE from "three"

/**
 * Safely extracts a string URL from various video source formats
 * @param src The video source (string, object with default property, or object with toString method)
 * @returns A string URL or empty string if source cannot be processed
 */
export function getVideoSourceString(src: string | { default: string } | { toString: () => string } | null | undefined): string {
  if (!src) {
    console.log("Video source is undefined or null")
    return ""
  }

  if (typeof src === "string") {
    return src
  }

  if (typeof src === "object") {
    if ("default" in src) {
      return src.default
    }

    if (typeof src.toString === "function") {
      return src.toString()
    }
  }

  return ""
}

/**
 * Tests if a video URL is valid and can be played
 * @param url The video URL to test
 * @returns Promise that resolves with a result object
 */
export async function testVideoUrl(url: string): Promise<{
  canLoad: boolean
  canPlay: boolean
  error?: string
  details?: {
    width: number
    height: number
    duration: number
  }
}> {
  return new Promise((resolve) => {
    if (!url) {
      resolve({
        canLoad: false,
        canPlay: false,
        error: "Empty URL provided",
      })
      return
    }

    const video = document.createElement("video")
    video.muted = true
    video.crossOrigin = "anonymous"

    // Set timeout to avoid hanging
    const timeout = setTimeout(() => {
      resolve({
        canLoad: false,
        canPlay: false,
        error: "Timeout while loading video",
      })
    }, 10000)

    // Success handler
    video.addEventListener("canplay", () => {
      clearTimeout(timeout)
      resolve({
        canLoad: true,
        canPlay: true,
        details: {
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        },
      })
    })

    // Error handler
    video.addEventListener("error", () => {
      clearTimeout(timeout)
      let errorMessage = "Unknown error"

      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = "MEDIA_ERR_ABORTED - The fetching process was aborted"
            break
          case 2:
            errorMessage = "MEDIA_ERR_NETWORK - A network error occurred"
            break
          case 3:
            errorMessage = "MEDIA_ERR_DECODE - The media could not be decoded"
            break
          case 4:
            errorMessage = "MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported"
            break
          default:
            errorMessage = `Unknown error code: ${video.error.code}`
        }
      }

      resolve({
        canLoad: false,
        canPlay: false,
        error: errorMessage,
        details: undefined,
      })
    })

    // Try to load the video
    video.src = url
    video.load()
  })
}

/**
 * Checks if a URL is accessible via fetch
 * @param url The URL to check
 * @returns Promise that resolves with a result object
 */
export async function checkUrlAccessibility(url: string): Promise<{
  accessible: boolean
  status?: number
  statusText?: string
  error?: string
}> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return {
      accessible: response.ok,
      status: response.status,
      statusText: response.statusText,
    }
  } catch (err) {
    return {
      accessible: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }
}

/**
 * Preloads a video and creates a Three.js compatible video texture
 * @param videoUrl The URL of the video to preload
 * @returns Promise that resolves with the video element and texture
 */
export async function preloadVideoTexture(videoUrl: string): Promise<{
  videoElement: HTMLVideoElement
  texture: THREE.VideoTexture | null
  error?: string
}> {
  return new Promise((resolve) => {
    try {
      // Create video element
      const videoElement = document.createElement("video")
      videoElement.style.display = "none"
      videoElement.crossOrigin = "anonymous"
      videoElement.loop = true
      videoElement.muted = true
      videoElement.playsInline = true
      videoElement.preload = "auto"
      videoElement.src = videoUrl

      // Add to DOM temporarily
      document.body.appendChild(videoElement)

      // Set up event listeners
      const onError = () => {
        if (document.body.contains(videoElement)) {
          document.body.removeChild(videoElement)
        }

        resolve({
          videoElement,
          texture: null,
          error: videoElement.error ? `Video error code ${videoElement.error.code}` : "Unknown video error",
        })
      }

      const onLoadedData = () => {
        // Create texture
        const texture = new THREE.VideoTexture(videoElement)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat

        resolve({
          videoElement,
          texture,
        })
      }

      videoElement.addEventListener("error", onError)
      videoElement.addEventListener("loadeddata", onLoadedData)

      // Start loading
      videoElement.load()
    } catch (err) {
      resolve({
        videoElement: document.createElement("video"),
        texture: null,
        error: err instanceof Error ? err.message : "Unknown error during preload",
      })
    }
  })
}


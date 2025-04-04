"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { tourData } from "../Components/Virtual-tour/FeaturedTours"
import { getSignedVideoUrl, testS3Connection } from "../aws-s3-service"
import { LoadingSpinner } from "../Components/Virtual-tour/LoadingSpinner"
import SimpleVideoViewer from "../Components/Virtual-tour/AFrameVideoViewer2"
import { ErrorBoundary } from "react-error-boundary"

// Import the HotspotDebugger
import HotspotDebugger from "../Components/Virtual-tour/HotspotDebugger"

// Update the interface to work with the new scene-based structure
interface EnhancedTourData {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  scenes: {
    id: number
    videoKey: string
    hotspots?: {
      id: string
      position: { x: number; y: number }
      targetSceneId: number
      icon?: string
      tooltip?: string
      startTime?: number
      endTime?: number
    }[]
  }[]
}

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white text-center max-w-md p-6 bg-gray-900 rounded-lg">
        <h2 className="text-2xl mb-4">Something went wrong</h2>
        <p className="mb-4 text-red-400">{error.message}</p>
        <button
          className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
    </div>
  )
}

// Convert the tour data to the enhanced format
const enhancedTourData: EnhancedTourData[] = tourData as unknown as EnhancedTourData[]

const EnhancedSingleVirtualTourPage: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>()
  const [searchParams] = useSearchParams()
  const sceneParam = searchParams.get("scene")
  const navigate = useNavigate()

  // Initialize state from URL params, searchParams, or localStorage
  const [currentTourId] = useState<number>(() => {
    return Number.parseInt(tourId || "1")
  })

  // Add state for current scene within the tour, prioritizing URL query param
  const [currentSceneId, setCurrentSceneId] = useState<number>(() => {
    if (sceneParam) {
      return Number.parseInt(sceneParam)
    }
    const saved = localStorage.getItem("currentScene")
    return saved ? Number.parseInt(saved) : 1
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transitioningToScene, setTransitioningToScene] = useState<number | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [selectedQuality] = useState<string>("Low")
  const [hasError, setHasError] = useState<boolean>(false)
  const [forceS3, setForceS3] = useState<boolean>(false)
  const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null)

  // Add a key to force remount of the video component when changing scenes
  const [videoKey, setVideoKey] = useState<number>(0)

  // Add state to track if user has interacted with the page
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false)

  // Ref to track if the component has mounted
  const isMounted = useRef(false)

  // Update URL when scene changes
  useEffect(() => {
    // Update URL without page reload, preserving the scene parameter
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("scene", currentSceneId.toString())
    navigate(`/virtual-tour/${currentTourId}?${newSearchParams.toString()}`, { replace: true })

    // Also persist to localStorage
    localStorage.setItem("currentTour", currentTourId.toString())
    localStorage.setItem("currentScene", currentSceneId.toString())
  }, [currentTourId, currentSceneId, navigate, searchParams])

  // Get the current tour
  const currentTour = enhancedTourData.find((tour) => tour.id === currentTourId)

  // Get the current scene
  const currentScene = currentTour?.scenes.find((scene) => scene.id === currentSceneId) || currentTour?.scenes[0]

  console.log("Enhanced Tour Page - Current Tour:", currentTour?.title)
  console.log("Enhanced Tour Page - Current Scene:", currentSceneId)
  console.log("Enhanced Tour Page - Scene from URL:", sceneParam)
  console.log("Enhanced Tour Page - VideoKey:", currentScene?.videoKey)

  // Test S3 connection on mount
  useEffect(() => {
    const runConnectionTest = async () => {
      try {
        const result = await testS3Connection()
        setConnectionTest(result)
        console.log("S3 Connection Test:", result)
      } catch (error) {
        console.error("Error testing S3 connection:", error)
        setConnectionTest({
          success: false,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    runConnectionTest()

    // Add event listener to track user interaction
    const handleUserInteraction = () => {
      setHasUserInteracted(true)
    }

    window.addEventListener("click", handleUserInteraction)
    window.addEventListener("touchstart", handleUserInteraction)

    return () => {
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [])

  // Fetch video URL when scene changes or quality changes
  useEffect(() => {
    if (!currentScene) {
      console.log("No current scene found")
      return
    }

    if (!currentScene.videoKey) {
      console.log("No videoKey found for current scene")
      return
    }

    setIsLoading(true)
    setHasError(false)

    const fetchVideoUrl = async () => {
      try {
        console.log("Fetching video URL for key:", currentScene.videoKey)
        // Try to get the signed URL from S3
        const url = await getSignedVideoUrl(currentScene.videoKey)
        console.log("Received signed URL:", url)

        // Increment the video key to force remount
        setVideoKey((prevKey) => prevKey + 1)

        setVideoUrl(url)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching video URL:", error)
        console.error("Error details:", error instanceof Error ? error.message : String(error))
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available")

        // Show error
        setHasError(true)
        setIsLoading(false)
      }
    }

    fetchVideoUrl()
  }, [currentTourId, currentSceneId, selectedQuality, forceS3])

  if (!currentTour) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Tour not found</h2>
          <button
            className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
            onClick={() => navigate("/virtual-tour")}
          >
            Back to Tours
          </button>
        </div>
      </div>
    )
  }

  // Define handleHotspotClick outside of useCallback
  const handleHotspotClick = (targetSceneId: number) => {
    console.log("Hotspot clicked in parent component, navigating to scene:", targetSceneId)

    // Check if the target scene exists
    const targetScene = currentTour?.scenes.find((scene) => scene.id === targetSceneId)
    if (!targetScene) {
      console.error(`Target scene ${targetSceneId} not found!`)
      return
    }

    setTransitioningToScene(targetSceneId)

    // Add a slight delay before changing scenes for better UX
    setTimeout(() => {
      setCurrentSceneId(targetSceneId)
      setTransitioningToScene(null)

      // Update URL with new scene ID
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set("scene", targetSceneId.toString())
      navigate(`/virtual-tour/${currentTourId}?${newSearchParams.toString()}`, { replace: true })
    }, 300)
  }

  // Handle user interaction notification
  const handleUserInteractionNotification = useCallback(() => {
    setHasUserInteracted(true)
  }, [])

  // Preload the next scene's video to reduce buffering when navigating
  const preloadNextScene = useCallback(() => {
    if (!currentTour || !currentScene) return

    // Find the current scene index
    const currentSceneIndex = currentTour.scenes.findIndex((scene) => scene.id === currentSceneId)
    if (currentSceneIndex === -1) return

    // Get the next scene (if any)
    const nextScene = currentTour.scenes[currentSceneIndex + 1]
    if (!nextScene) return

    console.log("Preloading next scene:", nextScene.id, nextScene.videoKey)

    // Start fetching the signed URL in the background
    getSignedVideoUrl(nextScene.videoKey)
      .then((url) => {
        console.log("Preloaded signed URL for next scene")
        // Create a hidden video element to start buffering
        const video = document.createElement("video")
        video.style.display = "none"
        video.preload = "auto"
        video.src = url
        video.load()

        // Remove after 10 seconds to avoid memory issues
        setTimeout(() => {
          if (document.body.contains(video)) {
            try {
              document.body.removeChild(video)
            } catch (e) {
              console.warn("Could not remove preload video:", e)
            }
          }
        }, 10000)

        document.body.appendChild(video)
      })
      .catch((err) => console.error("Error preloading next scene:", err))
  }, [currentTourId, currentSceneId, currentTour, currentScene])

  useEffect(() => {
    // Only proceed if the component has mounted
    if (!isMounted.current) {
      return
    }

    // Add a slight delay to prioritize current video playback
    if (!isLoading && videoUrl) {
      const timer = setTimeout(() => {
        preloadNextScene()
      }, 5000) // Wait 5 seconds after current video loads

      return () => clearTimeout(timer)
    }
  }, [isLoading, videoUrl, preloadNextScene])

  // Add this useEffect to trigger preloading when the current scene changes
  useEffect(() => {
    // Set isMounted to true after the first render
    isMounted.current = true

    // Define a function to handle preloading
    const handlePreload = useCallback(() => {
      if (!isLoading && videoUrl) {
        // Add a slight delay to prioritize current video playback
        const timer = setTimeout(() => {
          preloadNextScene()
        }, 5000) // Wait 5 seconds after current video loads

        return () => clearTimeout(timer)
      }
    }, [isLoading, videoUrl, preloadNextScene])

    // Call the preload handler
    handlePreload()

    // Cleanup function
    return () => {
      // Nothing to clean up here
    }
  }, [isLoading, videoUrl, preloadNextScene])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Debug info */}
      <div className="absolute top-20 left-5 z-50 bg-black bg-opacity-70 p-2 text-white text-xs">
        <p>Tour ID: {currentTourId}</p>
        <p>Scene ID: {currentSceneId}</p>
        <p>Scene from URL: {sceneParam || "None"}</p>
        <p>Video Key: {currentScene?.videoKey || "None"}</p>
        <p>Has Video URL: {videoUrl ? "Yes" : "No"}</p>
        <p>Quality: {selectedQuality}</p>
        <p>Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Error: {hasError ? "Yes" : "No"}</p>
        <p>S3 Connection: {connectionTest ? (connectionTest.success ? "Success" : "Failed") : "Testing..."}</p>
        <p>Connection Message: {connectionTest?.message || "N/A"}</p>
        <p>Preloading: {!isLoading && videoUrl ? "Active" : "Waiting for current video"}</p>
        <p>User Interacted: {hasUserInteracted ? "Yes" : "No"}</p>
        <p>Video Component Key: {videoKey}</p>
      </div>

      {/* Force S3 button */}
      <button
        onClick={() => setForceS3(!forceS3)}
        className="absolute top-5 right-5 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        {forceS3 ? "Disable Force S3" : "Force S3"}
      </button>

      {/* Test S3 Connection button */}
      <button
        onClick={async () => {
          try {
            setConnectionTest(null) // Reset to show testing
            const result = await testS3Connection()
            setConnectionTest(result)
            console.log("S3 Connection Test:", result)

            if (result.success && currentScene?.videoKey) {
              // If connection is successful, try to get the video URL directly
              const url = await getSignedVideoUrl(currentScene.videoKey)
              console.log("Test URL generated:", url)
              setVideoUrl(url)
            }
          } catch (error) {
            console.error("Error in test button:", error)
            setConnectionTest({
              success: false,
              message: error instanceof Error ? error.message : String(error),
            })
          }
        }}
        className="absolute top-5 right-40 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        Test S3 Now
      </button>

      {/* Back button */}
      <button
        onClick={() => navigate("/virtual-tour")}
        className="absolute top-5 left-5 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
      >
        Back
      </button>

      {/* Scene indicator */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 bg-black bg-opacity-70 text-white rounded-full">
        Scene {currentSceneId} of {currentTour.scenes.length}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <LoadingSpinner />
        </div>
      )}

      {/* Transition overlay */}
      {transitioningToScene !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <LoadingSpinner />
          <p className="mt-4 text-white">Transitioning to Scene {transitioningToScene}...</p>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="text-white text-center">
            <h2 className="text-2xl mb-4">Failed to load video</h2>
            <button
              className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Video Viewer with Error Boundary */}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset the error state
          setHasError(false)
          // Attempt to reload the video
          if (currentScene?.videoKey) {
            getSignedVideoUrl(currentScene.videoKey)
              .then((url) => setVideoUrl(url))
              .catch((err) => {
                console.error("Error reloading video:", err)
                setHasError(true)
              })
          }
        }}
      >
        {/* Use the key prop to force remount when changing scenes */}
        <SimpleVideoViewer
          key={videoKey}
          videoUrl={videoUrl}
          hotspots={currentScene?.hotspots?.map((hotspot) => ({
            ...hotspot,
            id: Number(hotspot.id), // Convert id to number
            tooltip: `Go to Scene ${hotspot.targetSceneId}`,
          }))}
          onHotspotClick={handleHotspotClick}
          autoPlay={hasUserInteracted}
          onUserInteraction={handleUserInteractionNotification}
          initialQuality={selectedQuality}
        />
      </ErrorBoundary>

      {/* Add HotspotDebugger */}
      <HotspotDebugger onHotspotClick={handleHotspotClick} />
    </div>
  )
}

export default EnhancedSingleVirtualTourPage


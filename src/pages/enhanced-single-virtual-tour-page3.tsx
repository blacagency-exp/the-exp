// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useRef } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { tourData } from "../Components/Virtual-tour/FeaturedTours"
// import { getSignedVideoUrl, testS3Connection } from "../aws-s3-service2"
// import { LoadingSpinner } from "../Components/Virtual-tour/LoadingSpinner"
// import SimpleVideoViewer from "../Components/Virtual-tour/SimpleVideoViewer"
// import { ErrorBoundary } from "react-error-boundary"

// // Import the HotspotDebugger
// import HotspotDebugger from "../Components/Virtual-tour/HotspotDebugger"

// // Update the interface to work with the new scene-based structure
// interface EnhancedTourData {
//   id: number
//   title: string
//   description: string
//   image: string
//   tags: string[]
//   scenes: {
//     id: number
//     videoKey: string
//     hotspots?: {
//       id: string
//       position: { x: number; y: number }
//       targetSceneId: number
//       icon?: string
//       tooltip?: string
//       startTime?: number
//       endTime?: number
//     }[]
//   }[]
// }

// // Error Fallback component
// const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
//   return (
//     <div className="flex items-center justify-center h-screen bg-black">
//       <div className="text-white text-center max-w-md p-6 bg-gray-900 rounded-lg">
//         <h2 className="text-2xl mb-4">Something went wrong</h2>
//         <p className="mb-4 text-red-400">{error.message}</p>
//         <button
//           className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
//           onClick={resetErrorBoundary}
//         >
//           Try again
//         </button>
//       </div>
//     </div>
//   )
// }

// // Convert the tour data to the enhanced format
// const enhancedTourData: EnhancedTourData[] = tourData as unknown as EnhancedTourData[]

// const EnhancedSingleVirtualTourPage: React.FC = () => {
//   const { tourId } = useParams<{ tourId: string }>()
//   const navigate = useNavigate()

//   // Initialize state from localStorage or params
//   const [currentTourId, setCurrentTourId] = useState<number>(() => {
//     const saved = localStorage.getItem("currentTour")
//     return saved ? Number.parseInt(saved) : Number.parseInt(tourId || "1")
//   })

//   // Add state for current scene within the tour
//   const [currentSceneId, setCurrentSceneId] = useState<number>(1)

//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [transitioningToScene, setTransitioningToScene] = useState<number | null>(null)
//   const [videoUrl, setVideoUrl] = useState<string | null>(null)
//   const [selectedQuality, setSelectedQuality] = useState<string>("auto")
//   const [hasError, setHasError] = useState<boolean>(false)
//   const [forceS3, setForceS3] = useState<boolean>(false)
//   const [connectionTest, setConnectionTest] = useState<{ success: boolean; message: string } | null>(null)

//   // Add a key to force remount of the video component when changing scenes
//   const [videoKey, setVideoKey] = useState<number>(0)

//   // Add state to track if user has interacted with the page
//   const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false)

//   // Ref to track if the component has mounted
//   const isMounted = useRef(false)

//   // Ref to track the current scene transition
//   const sceneTransitionRef = useRef<{
//     from: number | null
//     to: number | null
//     inProgress: boolean
//   }>({
//     from: null,
//     to: null,
//     inProgress: false,
//   })

//   // Ref to hold the preload video element
//   const preloadVideoRef = useRef<HTMLVideoElement | null>(null)

//   // Persist state to localStorage
//   useEffect(() => {
//     localStorage.setItem("currentTour", currentTourId.toString())
//     localStorage.setItem("currentScene", currentSceneId.toString())
//     // Update URL without page reload
//     navigate(`/virtual-tour/${currentTourId}`, { replace: true })
//   }, [currentTourId, currentSceneId, navigate])

//   // Get the current tour
//   const currentTour = enhancedTourData.find((tour) => tour.id === currentTourId)

//   // Get the current scene
//   const currentScene = currentTour?.scenes.find((scene) => scene.id === currentSceneId) || currentTour?.scenes[0]

//   console.log("Enhanced Tour Page - Current Tour:", currentTour?.title)
//   console.log("Enhanced Tour Page - Current Scene:", currentSceneId)
//   console.log("Enhanced Tour Page - VideoKey:", currentScene?.videoKey)

//   // Test S3 connection on mount
//   useEffect(() => {
//     const runConnectionTest = async () => {
//       try {
//         const result = await testS3Connection()
//         setConnectionTest(result)
//         console.log("S3 Connection Test:", result)
//       } catch (error) {
//         console.error("Error testing S3 connection:", error)
//         setConnectionTest({
//           success: false,
//           message: error instanceof Error ? error.message : String(error),
//         })
//       }
//     }

//     runConnectionTest()

//     // Add event listener to track user interaction
//     const handleUserInteraction = () => {
//       setHasUserInteracted(true)
//     }

//     window.addEventListener("click", handleUserInteraction)
//     window.addEventListener("touchstart", handleUserInteraction)

//     // Set isMounted to true
//     isMounted.current = true

//     return () => {
//       window.removeEventListener("click", handleUserInteraction)
//       window.removeEventListener("touchstart", handleUserInteraction)
//       isMounted.current = false
//     }
//   }, [])

//   // Fetch video URL when scene changes or quality changes
//   useEffect(() => {
//     if (!currentScene) {
//       console.log("No current scene found")
//       return
//     }

//     if (!currentScene.videoKey) {
//       console.log("No videoKey found for current scene")
//       return
//     }

//     setIsLoading(true)
//     setHasError(false)

//     const fetchVideoUrl = async () => {
//       let retryCount = 0
//       const maxRetries = 3

//       const attemptFetch = async () => {
//         try {
//           console.log(`Fetching video URL for key: ${currentScene.videoKey} (attempt ${retryCount + 1})`)
//           // Try to get the signed URL from S3
//           const url = await getSignedVideoUrl(currentScene.videoKey)
//           console.log("Received signed URL:", url)

//           // Increment the video key to force remount
//           setVideoKey((prevKey) => prevKey + 1)

//           setVideoUrl(url)
//           setIsLoading(false)

//           // Update scene transition state
//           if (sceneTransitionRef.current.inProgress) {
//             sceneTransitionRef.current.inProgress = false
//             setTransitioningToScene(null)
//           }
//         } catch (error) {
//           console.error(`Error fetching video URL (attempt ${retryCount + 1}):`, error)

//           if (retryCount < maxRetries) {
//             retryCount++
//             console.log(`Retrying in 1 second... (${retryCount}/${maxRetries})`)
//             setTimeout(attemptFetch, 1000)
//           } else {
//             console.error("Max retries reached, showing error")
//             setHasError(true)
//             setIsLoading(false)

//             // Reset scene transition state
//             if (sceneTransitionRef.current.inProgress) {
//               sceneTransitionRef.current.inProgress = false
//               setTransitioningToScene(null)
//             }
//           }
//         }
//       }

//       await attemptFetch()
//     }

//     fetchVideoUrl()
//   }, [currentTourId, currentSceneId, selectedQuality, forceS3])

//   if (!currentTour) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-black">
//         <div className="text-white text-center">
//           <h2 className="text-2xl mb-4">Tour not found</h2>
//           <button
//             className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
//             onClick={() => navigate("/virtual-tour")}
//           >
//             Back to Tours
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Define handleHotspotClick outside of useCallback
//   const handleHotspotClick = (targetSceneId: number) => {
//     console.log("Hotspot clicked in parent component, navigating to scene:", targetSceneId)

//     // Check if the target scene exists
//     const targetScene = currentTour?.scenes.find((scene) => scene.id === targetSceneId)
//     if (!targetScene) {
//       console.error(`Target scene ${targetSceneId} not found!`)
//       return
//     }

//     // Check if we're already transitioning
//     if (sceneTransitionRef.current.inProgress) {
//       console.log("Scene transition already in progress, ignoring click")
//       return
//     }

//     // Update transition state
//     sceneTransitionRef.current = {
//       from: currentSceneId,
//       to: targetSceneId,
//       inProgress: true,
//     }

//     setTransitioningToScene(targetSceneId)

//     // Add a slight delay before changing scenes for better UX
//     setTimeout(() => {
//       setCurrentSceneId(targetSceneId)

//       // Force a new video key to ensure complete remount of the video component
//       setVideoKey((prevKey) => prevKey + 100)

//       // Clear the video URL to force a fresh fetch
//       setVideoUrl(null)

//       // Set a timeout to clear the transition state if it gets stuck
//       setTimeout(() => {
//         if (sceneTransitionRef.current.inProgress) {
//           console.log("Scene transition timeout - resetting transition state")
//           sceneTransitionRef.current.inProgress = false
//           setTransitioningToScene(null)
//         }
//       }, 10000) // 10 second timeout
//     }, 300)
//   }

//   // Memoize handleHotspotClick with useCallback
//   const handleHotspotClickRef = useRef(handleHotspotClick)

//   useEffect(() => {
//     handleHotspotClickRef.current = handleHotspotClick
//   }, [handleHotspotClick])

//   const memoizedHandleHotspotClick = useCallback((targetSceneId: number) => {
//     handleHotspotClickRef.current(targetSceneId)
//   }, [])

//   const handleQualityChange = (quality: string) => {
//     setSelectedQuality(quality)
//   }

//   // Handle user interaction notification
//   const handleUserInteractionNotification = useCallback(() => {
//     setHasUserInteracted(true)
//   }, [])

//   // Preload the next scene's video to reduce buffering when navigating
//   const preloadNextScene = useCallback(() => {
//     // Only proceed if the component has mounted
//     if (!isMounted.current) {
//       return
//     }

//     if (!currentTour || !currentScene) return

//     // Find the current scene index
//     const currentSceneIndex = currentTour.scenes.findIndex((scene) => scene.id === currentSceneId)
//     if (currentSceneIndex === -1) return

//     // Get the next scene (if any)
//     const nextScene = currentTour.scenes[currentSceneIndex + 1]
//     if (!nextScene) return

//     console.log("Preloading next scene:", nextScene.id, nextScene.videoKey)

//     // Start fetching the signed URL in the background
//     getSignedVideoUrl(nextScene.videoKey)
//       .then((url) => {
//         console.log("Preloaded signed URL for next scene")
//         // Create a hidden video element to start buffering
//         const video = document.createElement("video")
//         video.style.display = "none"
//         video.preload = "auto"
//         video.src = url
//         video.load()

//         // Remove after 10 seconds to avoid memory issues
//         setTimeout(() => {
//           if (document.body.contains(video)) {
//             try {
//               document.body.removeChild(video)
//             } catch (e) {
//               console.warn("Could not remove preload video:", e)
//             }
//           }
//         }, 10000)

//         document.body.appendChild(video)
//       })
//       .catch((err) => console.error("Error preloading next scene:", err))
//   }, [currentTourId, currentSceneId, currentTour, currentScene])

//   // Add this function after the preloadNextScene function
//   const preloadScene = useCallback(
//     (sceneId: number) => {
//       if (!currentTour) return

//       const sceneToPreload = currentTour.scenes.find((scene) => scene.id === sceneId)
//       if (!sceneToPreload || !sceneToPreload.videoKey) {
//         console.log(`Cannot preload scene ${sceneId}: scene not found or no video key`)
//         return
//       }

//       console.log(`Actively preloading scene ${sceneId} with key ${sceneToPreload.videoKey}`)

//       // Get the signed URL
//       getSignedVideoUrl(sceneToPreload.videoKey)
//         .then((url) => {
//           console.log(`Got signed URL for scene ${sceneId}, starting preload`)

//           // Create a hidden video element to preload
//           if (preloadVideoRef.current) {
//             document.body.removeChild(preloadVideoRef.current)
//           }

//           const video = document.createElement("video")
//           video.style.display = "none"
//           video.crossOrigin = "anonymous"
//           video.preload = "auto"
//           video.muted = true
//           video.src = url

//           // Add event listeners
//           video.addEventListener("canplaythrough", () => {
//             console.log(`Scene ${sceneId} preloaded successfully`)
//           })

//           video.addEventListener("error", (e) => {
//             console.error(`Error preloading scene ${sceneId}:`, e)
//           })

//           // Start loading
//           video.load()
//           document.body.appendChild(video)
//           preloadVideoRef.current = video
//         })
//         .catch((err) => {
//           console.error(`Error getting signed URL for scene ${sceneId}:`, err)
//         })
//     },
//     [currentTour],
//   )

//   // Add this useEffect to trigger preloading when the current scene changes
//   useEffect(() => {
//     // Define a function to handle preloading
//     const handlePreload = () => {
//       if (!isLoading && videoUrl) {
//         // Add a slight delay to prioritize current video playback
//         const timer = setTimeout(() => {
//           preloadNextScene()
//         }, 5000) // Wait 5 seconds after current video loads

//         return () => clearTimeout(timer)
//       }
//     }

//     // Call the preload handler
//     handlePreload()
//   }, [isLoading, videoUrl, preloadNextScene])

//   // Add this useEffect after the other useEffects
//   useEffect(() => {
//     // Preload scene 2 when the component mounts
//     if (currentTour && currentTour.scenes.length > 1) {
//       const scene2 = currentTour.scenes.find((scene) => scene.id === 2)
//       if (scene2) {
//         console.log("Preloading scene 2 on component mount")
//         preloadScene(2)
//       }
//     }
//   }, [currentTour, preloadScene])

//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-black">
//       {/* Debug info */}
//       <div className="absolute top-20 left-5 z-50 bg-black bg-opacity-70 p-2 text-white text-xs">
//         <p>Tour ID: {currentTourId}</p>
//         <p>Scene ID: {currentSceneId}</p>
//         <p>Video Key: {currentScene?.videoKey || "None"}</p>
//         <p>Has Video URL: {videoUrl ? "Yes" : "No"}</p>
//         <p>Quality: {selectedQuality}</p>
//         <p>Loading: {isLoading ? "Yes" : "No"}</p>
//         <p>Error: {hasError ? "Yes" : "No"}</p>
//         <p>S3 Connection: {connectionTest ? (connectionTest.success ? "Success" : "Failed") : "Testing..."}</p>
//         <p>Connection Message: {connectionTest?.message || "N/A"}</p>
//         <p>Preloading: {!isLoading && videoUrl ? "Active" : "Waiting for current video"}</p>
//         <p>User Interacted: {hasUserInteracted ? "Yes" : "No"}</p>
//         <p>Video Component Key: {videoKey}</p>
//         <p>
//           Scene Transition:{" "}
//           {sceneTransitionRef.current.inProgress
//             ? `${sceneTransitionRef.current.from} → ${sceneTransitionRef.current.to}`
//             : "None"}
//         </p>
//       </div>

//       {/* Force S3 button */}
//       <button
//         onClick={() => setForceS3(!forceS3)}
//         className="absolute top-5 right-5 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
//       >
//         {forceS3 ? "Disable Force S3" : "Force S3"}
//       </button>

//       {/* Test S3 Connection button */}
//       <button
//         onClick={async () => {
//           try {
//             setConnectionTest(null) // Reset to show testing
//             const result = await testS3Connection()
//             setConnectionTest(result)
//             console.log("S3 Connection Test:", result)

//             if (result.success && currentScene?.videoKey) {
//               // If connection is successful, try to get the video URL directly
//               const url = await getSignedVideoUrl(currentScene.videoKey)
//               console.log("Test URL generated:", url)
//               setVideoUrl(url)
//             }
//           } catch (error) {
//             console.error("Error in test button:", error)
//             setConnectionTest({
//               success: false,
//               message: error instanceof Error ? error.message : String(error),
//             })
//           }
//         }}
//         className="absolute top-5 right-40 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
//       >
//         Test S3 Now
//       </button>

//       {/* Back button */}
//       <button
//         onClick={() => navigate("/virtual-tour")}
//         className="absolute top-5 left-5 z-20 px-4 py-2 bg-[#5A8E00] text-white border-none rounded-md cursor-pointer hover:bg-opacity-80 transition-colors"
//       >
//         Back
//       </button>

//       {/* Loading overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
//           <LoadingSpinner />
//         </div>
//       )}

//       {/* Transition overlay */}
//       {transitioningToScene !== null && (
//         <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
//           <LoadingSpinner />
//           <p className="mt-4 text-white">Transitioning to Scene {transitioningToScene}...</p>
//         </div>
//       )}

//       {/* Error message */}
//       {hasError && (
//         <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-80">
//           <div className="text-white text-center">
//             <h2 className="text-2xl mb-4">Failed to load video</h2>
//             <button
//               className="px-4 py-2 bg-[#97E12B] text-black rounded-md hover:bg-opacity-80 transition-colors"
//               onClick={() => window.location.reload()}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Video Viewer with Error Boundary */}
//       <ErrorBoundary
//         FallbackComponent={ErrorFallback}
//         onReset={() => {
//           // Reset the error state
//           setHasError(false)
//           // Attempt to reload the video
//           if (currentScene?.videoKey) {
//             getSignedVideoUrl(currentScene.videoKey)
//               .then((url) => setVideoUrl(url))
//               .catch((err) => {
//                 console.error("Error reloading video:", err)
//                 setHasError(true)
//               })
//           }
//         }}
//       >
//         {/* Use the key prop to force remount when changing scenes */}
//         <SimpleVideoViewer
//           key={videoKey}
//           videoUrl={videoUrl}
//           hotspots={currentScene?.hotspots?.map((hotspot) => ({
//             ...hotspot,
//             tooltip: `Go to Scene ${hotspot.targetSceneId}`,
//           }))}
//           onHotspotClick={memoizedHandleHotspotClick}
//           autoPlay={hasUserInteracted}
//           onUserInteraction={handleUserInteractionNotification}
//           initialQuality={selectedQuality}
//         />
//       </ErrorBoundary>

//       {/* Add HotspotDebugger */}
//       <HotspotDebugger onHotspotClick={memoizedHandleHotspotClick} />
//     </div>
//   )
// }

// export default EnhancedSingleVirtualTourPage


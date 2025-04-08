"use client"

// Add this to your EnhancedSingleVirtualTourPage.tsx file at the beginning of the component
import { tourData } from "@/Components/Virtual-tour/featured-tours2"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function EnhancedSingleVirtualTourPage() {
  const { tourId } = useParams<{ tourId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sceneId = Number.parseInt(searchParams.get("scene") || "1")

  // Add these console logs to debug the data flow
  console.log("Available tour data:", tourData)
  console.log("Current tourId from params:", tourId)
  console.log("Current sceneId from query:", sceneId)

  const [currentTour] = useState(() => {
    const foundTour = tourData.find((tour) => tour.id === Number.parseInt(tourId || "1")) || tourData[0]
    console.log("Selected tour:", foundTour)
    return foundTour
  })

  const [currentScene] = useState(() => {
    const foundScene = currentTour.scenes.find((scene) => scene.id === sceneId) || currentTour.scenes[0]
    console.log("Selected scene:", foundScene)
    console.log("Scene youtubeId:", foundScene.youtubeId)
    return foundScene
  })

  // Rest of your component...
}


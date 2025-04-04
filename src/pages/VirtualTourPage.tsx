"use client"

import { BaseLayout } from "../Components/layout/BaseLayout"
import { HeroSection } from "../Components/Virtual-tour/HeroSection"
import { FeaturedTours } from "@/Components/Virtual-tour/FeaturedTours"
import { PopularLandmarks } from "@/Components/Virtual-tour/PopularLandmarks"
import { Routes, Route, useParams, useLocation } from "react-router-dom"
import EnhancedSingleVirtualTourPage from "./enhanced-single-virtual-tour-page" // Only use this component

export function VirtualTourPage() {
  const params = useParams()
  const location = useLocation()
  const isTourDetail = params.tourId !== undefined

  console.log("VirtualTourPage - Current path:", location.pathname)
  console.log("VirtualTourPage - Tour ID param:", params.tourId)
  console.log("VirtualTourPage - Is tour detail page:", isTourDetail)

  // If we have a tourId parameter, directly render the EnhancedSingleVirtualTourPage
  if (isTourDetail) {
    return <EnhancedSingleVirtualTourPage />
  }

  // Otherwise, render the main virtual tour page with nested routes
  return (
    <BaseLayout>
      <Routes>
        {/* Default route for the main VirtualTourPage */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <FeaturedTours />
              <PopularLandmarks />
            </>
          }
        />
      </Routes>
    </BaseLayout>
  )
}


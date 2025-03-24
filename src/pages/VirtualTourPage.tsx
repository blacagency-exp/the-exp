import { BaseLayout } from "../Components/layout/BaseLayout";
import { HeroSection } from "../Components/Virtual-tour/HeroSection";
import { FeaturedTours } from "@/Components/Virtual-tour/FeaturedTours";
import { PopularLandmarks } from "@/Components/Virtual-tour/PopularLandmarks";
import { Routes, Route } from "react-router-dom";
import SingleVirtualTourPage from "./SingleVirtualTourPage"; // Import the SingleVirtualTourPage

export function VirtualTourPage() {
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
        {/* Route for individual virtual tours */}
        <Route path=":tourId" element={<SingleVirtualTourPage />} />
      </Routes>
    </BaseLayout>
  );
}
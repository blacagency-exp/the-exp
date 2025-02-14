import { FeaturedTours } from "@/Components/Virtual-tour/FeaturedTours"
import { BaseLayout } from "../Components/layout/BaseLayout"
import  {HeroSection}  from "../Components/Virtual-tour/HeroSection"
import { PopularLandmarks } from "@/Components/Virtual-tour/PopularLandmarks"

export function VirtualTourPage() {
  return (
    <BaseLayout>
      <HeroSection />
      <FeaturedTours/>
      <PopularLandmarks/>
    </BaseLayout>
  )
}


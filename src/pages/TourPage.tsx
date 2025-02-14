

import { HeroSection } from "@/Components/Tour/hero-section"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { MeetGuides } from "@/Components/Tour/meet-guides"
import { GuideOfMonth } from "@/Components/Tour/guide-of-the-month"
import { FaqSection } from "@/Components/Hotel/faq-section"





export function TourPage() {
  return (
    <BaseLayout>
       <HeroSection/>
       <MeetGuides/>
       <GuideOfMonth/>
       <FaqSection/>
    </BaseLayout>
  )
}


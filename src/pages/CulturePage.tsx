


import { CulturalHero } from "@/Components/Culture/cultural-hero"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { MuseumsSection } from "@/Components/Culture/museums-section"
import { FestivalsSection } from "@/Components/Culture/festivals-section"
import { ContactSection } from "@/Components/Home/ContactSection"






export function CulturePage() {
  return (
    <BaseLayout>
        <CulturalHero/>
        <MuseumsSection/>
        <FestivalsSection/>
         <ContactSection/>
    </BaseLayout>
  )
}


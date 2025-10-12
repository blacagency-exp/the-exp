"use client"

import { useEffect } from "react"
// import { useLocation } from "react-router-dom"
import { CulturalHero } from "@/Components/Culture/cultural-hero"
import { BaseLayout } from "@/Components/layout/BaseLayout"
import { MuseumsSection } from "@/Components/Culture/museums-section"
import { FestivalsSection } from "@/Components/Culture/festivals-section"
import { ContactSection } from "@/Components/Home/ContactSection"


export function CulturePage() {
  // const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <BaseLayout>
      <CulturalHero />
      <MuseumsSection />
       
      <FestivalsSection />
      <ContactSection />
    </BaseLayout>
  )
}


"use client"

import { BaseLayout } from "../Components/layout/BaseLayout"
import { GalleryHero } from "../Components/Gallery/GalleryHero"
import { InteractiveGallery } from "../Components/Gallery/InteractiveGallery"
// import { GalleryStats } from "../Components/Gallery/GalleryStats"

export function GalleryPage() {
  return (
    <BaseLayout>
      <GalleryHero />
      <InteractiveGallery />
      {/* <GalleryStats /> */}
    </BaseLayout>
  )
}

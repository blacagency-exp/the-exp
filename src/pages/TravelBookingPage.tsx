"use client"

import { useRef, useState } from "react"
import { Hero } from "@/Components/Travel-bookings/hero"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { TravelPackages } from "../Components/Travel-bookings/travel-packages"
// import { BookingForm } from "@/Components/Travel-bookings/booking-form"
import { ContactSection } from "@/Components/Home/ContactSection"
import { BookingRequestForm } from "@/Components/Travel-bookings/BookingRequestForm"


export function TravelBookingPage() {
  const bookingFormRef = useRef<HTMLDivElement>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined)

  const handlePackageClick = (packageTitle: string) => {
    setSelectedPackage(packageTitle)
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <BaseLayout>
      <Hero />
      <TravelPackages onPackageClick={handlePackageClick} />
      <div ref={bookingFormRef}>
        <BookingRequestForm selectedPackage={selectedPackage} />
      </div>
      <ContactSection />
     
    </BaseLayout>
  )
}


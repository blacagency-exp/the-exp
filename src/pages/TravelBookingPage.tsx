
import { Hero } from "@/Components/Travel-bookings/hero"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { TravelPackages } from "../Components/Travel-bookings/travel-packages"
import { BookingForm } from "@/Components/Travel-bookings/booking-form"
import { ContactSection } from "@/Components/Home/ContactSection"
import { InvestmentSection } from "@/Components/Home/InvestmentSection"


export function TravelBookingPage() {
  return (
    <BaseLayout>
     <Hero/>
    <TravelPackages/>
    <BookingForm/>
    <ContactSection/>
    <InvestmentSection/>
    </BaseLayout>
  )
}



import { HotelBooking } from "@/Components/Hotel/hotel-booking2"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { WhyBookSection } from "@/Components/Hotel/why-book-section"
import { HotelCategories } from "@/Components/Hotel/hotel-categories"
import { FaqSection } from "@/Components/Hotel/faq-section"




export function HotelPage() {
  return (
    <BaseLayout>
    <HotelBooking/>
    <WhyBookSection/>
    <HotelCategories/>
    <FaqSection/>
    </BaseLayout>
  )
}


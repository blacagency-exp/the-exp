


import { FaqSection } from "@/Components/Hotel/faq-section"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { ContactHero } from "@/Components/Contact/contact-hero"
// import { GetInTouch } from "@/Components/Contact/get-in-touch"







export function ContactPage() {
  return (
    <BaseLayout>
        <ContactHero/>
        {/* <GetInTouch/> */}
        <FaqSection/>
    </BaseLayout>
  )
}


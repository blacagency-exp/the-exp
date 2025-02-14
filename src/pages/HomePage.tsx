import { BaseLayout } from '../Components/layout/BaseLayout'
import { ExploreSection } from '@/Components/Home/ExploreSection'

import { InvestmentSection } from '@/Components/Home/InvestmentSection'
import { ContactSection } from '@/Components/Home/ContactSection'
import { HeroUpdate } from '@/Components/Home/HeroUpdate'
import { TextSection } from '@/Components/Home/TextSection'
import { FeaturedEvent } from '@/Components/Home/FeaturedEvent'



export function HomePage() {
  return (
    <BaseLayout>
      <HeroUpdate/>
      <TextSection/>
      <ExploreSection/>
       {/* <StaySection/>  */}
      <FeaturedEvent/>
      <InvestmentSection/>
      <ContactSection/>
    </BaseLayout>
  )
}


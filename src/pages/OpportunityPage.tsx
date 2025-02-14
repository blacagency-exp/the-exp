import { OpportunitiesHero } from '@/Components/Opportunity/opportunity-hero'
import { BaseLayout } from '../Components/layout/BaseLayout'
import { KeyInvestmentSectors } from '@/Components/Opportunity/KeyInvestmentSectors'


export function OpportunityPage() {
  return (
    <BaseLayout>
     <OpportunitiesHero/> 
     <KeyInvestmentSectors/>  
    </BaseLayout>
  )
}


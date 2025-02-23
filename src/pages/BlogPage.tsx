import HeroSlider from "@/Components/Blog/hero-slider"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { RecentBlogs } from "@/Components/Blog/recent-blogs"
//  import { PopularStories } from "@/Components/Blog/popular-stories"
import { ContactSection } from "@/Components/Home/ContactSection"



export function BlogPage() {
  return (
    <BaseLayout>
    <HeroSlider/>
    <RecentBlogs/>
     {/* <PopularStories/>  */}
    <ContactSection/>
    </BaseLayout>
  )
}


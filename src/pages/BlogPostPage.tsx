import { BlogPost } from "@/Components/BlogPost/blog-post"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { ExploreStories } from "@/Components/BlogPost/explore-stories"





export function BlogPostPage() {
  return (
    <BaseLayout>
    <BlogPost/>
   <ExploreStories/>
    </BaseLayout>
  )
}


import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BlogPost, type BlogPostProps } from "../Components/BlogPost/blog-post"
import { recentBlogs } from "../data/recentBlogs"
import { ExploreStories } from "../Components/BlogPost/explore-stories"
import { BaseLayout } from "../Components/layout/BaseLayout"

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const blog = recentBlogs.find((blog) => blog.slug === slug)

  if (!blog) {
    return <div>Blog post not found</div>
  }

  // Generate author articles
  const authorArticles = recentBlogs
    .filter((article) => article.slug !== slug)
    .slice(0, 3)
    .map((article) => article.title)

  const blogPostProps: BlogPostProps = {
    categories: [blog.category],
    title: blog.title,
    date: blog.date,
    author: blog.author || "Unknown Author",
    readTime: blog.readTime || "Unknown read time",
    mainImage: blog.imageUrl,
    secondaryImage: blog.imageUrl,
    sections: blog.content || [],
    authorArticles: authorArticles,
  }

  return (
    <React.Fragment>
      <BaseLayout>
      <BlogPost {...blogPostProps} />
      <ExploreStories currentSlug={slug || ""} />
      </BaseLayout>  
    </React.Fragment>
  )
}


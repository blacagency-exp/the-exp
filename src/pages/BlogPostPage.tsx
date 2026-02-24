import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BlogPost, type BlogPostProps } from "../Components/BlogPost/blog-post"
import { ExploreStories } from "../Components/BlogPost/explore-stories"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { client, urlFor } from "@/sanity/lib/client"
import { ActivityIndicator } from "@/Components/ui/ActivityIndicator"

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorArticles, setAuthorArticles] = useState<string[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchBlog = async () => {
      setLoading(true)
      try {
        const query = `*[_type == "blog" && slug.current == $slug][0]`
        const data = await client.fetch(query, { slug })

        if (data) {
          setBlog(data)

          // Fetch other articles by the same author
          const otherQuery = `*[_type == "blog" && author == $author && slug.current != $slug][0...3].title`
          const others = await client.fetch(otherQuery, { author: data.author, slug })
          setAuthorArticles(others)
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <ActivityIndicator message="Loading story..." />
        </div>
      </BaseLayout>
    )
  }

  if (!blog) {
    return (
      <BaseLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <p className="text-gray-500">The story you are looking for doesn't exist.</p>
        </div>
      </BaseLayout>
    )
  }

  const blogPostProps: BlogPostProps = {
    categories: [blog.category],
    title: blog.title,
    date: blog.date,
    author: blog.author || "Unknown Author",
    readTime: blog.readTime || "Unknown read time",
    mainImage: blog.mainImage ? urlFor(blog.mainImage).url() : "",
    secondaryImage: blog.secondaryImage ? urlFor(blog.secondaryImage).url() : undefined,
    sections: (blog.sections || []).map((section: any) => ({
      title: section.title,
      content: (section.content || []).map((c: any) => {
        if (c._type === 'paragraph') return { type: 'paragraph', text: c.text };
        if (c._type === 'emphasis') return { type: 'emphasis', text: c.text };
        if (c._type === 'list') return { type: c.type, items: c.items };
        return c;
      })
    })),
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


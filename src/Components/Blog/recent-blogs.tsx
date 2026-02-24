import { useEffect, useState } from "react"
import { BlogCard } from "./blog-card"
import { styles } from "../../constants/styles"
import { client, urlFor } from "@/sanity/lib/client"

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const query = `*[_type == "blog"] | order(date desc) {
          title,
          slug,
          date,
          category,
          description,
          author,
          readTime,
          "imageUrl": mainImage
        }`
        const data = await client.fetch(query)
        setBlogs(data)
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <section className={`${styles.section.container} mb-12 md:mb-24 flex justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#82CF00]"></div>
      </section>
    )
  }

  return (
    <section className={`${styles.section.container} mb-12 md:mb-24`}>
      <h2 className="text-3xl md:text-[40px] font-bold mb-8 md:mb-12">Recent Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {blogs.map((blog, index) => (
          <BlogCard
            key={index}
            {...blog}
            imageUrl={blog.imageUrl ? urlFor(blog.imageUrl).url() : ""}
            slug={blog.slug.current}
          />
        ))}
      </div>
    </section>
  )
}


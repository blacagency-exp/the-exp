import { BlogCard } from "./blog-card"
import { styles } from "../../constants/styles"
import { recentBlogs } from "../../data/recentBlogs"

export function RecentBlogs() {
  return (
    <section className={`${styles.section.container} mb-12 md:mb-24`}>
      <h2 className="text-3xl md:text-[40px] font-bold mb-8 md:mb-12">Recent Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {recentBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </section>
  )
}


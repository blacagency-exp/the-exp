import { BlogCard } from "./blog-card"
import { styles } from "../../constants/styles"

import { recentBlogs } from "../../data/recentBlogs"




export function RecentBlogs() {
  return (
    <section className={`${styles.section.container} mb-24`}>
      <h2 className="text-[40px] font-bold mb-12">Recent Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </section>
  )
}


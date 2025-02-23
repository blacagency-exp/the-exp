"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { styles } from "../../constants/styles"
import { recentBlogs } from "../../data/recentBlogs"

interface ExploreStoriesProps {
  currentSlug: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function ExploreStories({ currentSlug }: ExploreStoriesProps) {
  const otherStories = recentBlogs.filter((blog) => blog.slug !== currentSlug).slice(0, 3)

  return (
    <section className="py-24 bg-[#F5FFEB]">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-center mb-16"
        >
          Explore More Stories
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {otherStories.map((story) => (
            <motion.article
              key={story.slug}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="cursor-pointer group"
            >
              <Link to={`/blog/${story.slug}`} className="block">
                <div className="rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-6">
                    <img
                      src={story.imageUrl || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5A8E00]/50 font-light text-lg">{story.date}</span>
                      <span className="text-[#9FE870] font-light text-lg">{story.category}</span>
                    </div>
                    <h3 className="text-xl font-medium group-hover:text-[#9FE870] transition-colors">{story.title}</h3>
                    <p className="text-gray-600 line-clamp-2 text-md font-light">{story.description}</p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


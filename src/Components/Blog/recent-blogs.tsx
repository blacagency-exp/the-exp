import { BlogCard } from "./blog-card"
import { styles } from "../../constants/styles"
import img1 from "../../assets/muse.jpg"

const recentBlogs = [
  {
    date: "Oct 31,2024",
    category: "NATURE" as const,
    title: "From Peaks to Plains: Nature's Wonders",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-nature",
  },
  {
    date: "Oct 31,2024",
    category: "CULTURE" as const,
    title: "From Peaks to Plains: Cultural Odyssey",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-culture",
  },
  {
    date: "Oct 31,2024",
    category: "ADVENTURE" as const,
    title: "From Peaks to Plains: Thrilling Adventures",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-adventure",
  },
  {
    date: "Oct 31,2024",
    category: "TRAVEL" as const,
    title: "From Peaks to Plains: Journey Across Landscapes",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-travel",
  },
  {
    date: "Oct 31,2024",
    category: "NATURE" as const,
    title: "From Peaks to Plains: Flora and Fauna",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-flora-fauna",
  },
  {
    date: "Oct 31,2024",
    category: "ADVENTURE" as const,
    title: "From Peaks to Plains: Extreme Expeditions",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
    slug: "from-peaks-to-plains-extreme-expeditions",
  },
]

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


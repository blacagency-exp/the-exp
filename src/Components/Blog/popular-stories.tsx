import { BlogCard } from "./blog-card"
import { styles } from "../../constants/styles"
import img1 from '../../assets/muse.jpg'

const popularStories = [
  {
    date: "Oct 31,2024",
    category: "TRAVEL" as const,
    title: "From Peaks to Plains",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
  },
  {
    date: "Oct 31,2024",
    category: "TRAVEL" as const,
    title: "From Peaks to Plains",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl:  img1,
  },
  {
    date: "Oct 31,2024",
    category: "TRAVEL" as const,
    title: "From Peaks to Plains",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    imageUrl: img1,
  },
]

export function PopularStories() {
  return (
    <section className={styles.section.container}>
      <h2 className="text-[40px] font-bold mb-12">Popular Stories</h2>
      <div className="grid grid-cols-3 gap-8 mb-12">
        {popularStories.map((story, index) => (
          <BlogCard key={index} {...story} />
        ))}
      </div>
    </section>
  )
}


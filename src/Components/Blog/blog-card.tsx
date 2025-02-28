import { Link } from "react-router-dom"

interface BlogCardProps {
  date: string
  category: "NATURE" | "CULTURE" | "ADVENTURE" | "TRAVEL"
  title: string
  description: string
  imageUrl: string
  slug: string
}

export function BlogCard({ date, category, title, description, imageUrl, slug }: BlogCardProps) {
  const categoryColors: Record<BlogCardProps["category"], string> = {
    NATURE: "text-[#5A8E00]",
    CULTURE: "text-[#5A8E00]",
    ADVENTURE: "text-[#5A8E00]",
    TRAVEL: "text-[#5A8E00]",
  }

  return (
    <Link to={`/blog/${slug}`} className="block group">
      <article className="flex flex-col transition-transform duration-200 ease-in-out group-hover:-translate-y-1">
        <div className="rounded-2xl overflow-hidden mb-4 md:mb-6">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt=""
            className="w-full aspect-[4/3] object-cover bg-[#D9D9D9] transition-transform duration-200 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <time className="text-xs md:text-sm text-[#666666]">{date}</time>
            <span className={`text-xs md:text-sm font-medium ${categoryColors[category]}`}>{category}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-medium group-hover:text-[#5A8E00] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm md:text-base text-[#666666] leading-relaxed">{description}</p>
        </div>
      </article>
    </Link>
  )
}


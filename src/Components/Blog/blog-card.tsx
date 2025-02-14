interface BlogCardProps {
    date: string
    category: "NATURE" | "CULTURE" | "ADVENTURE" | "TRAVEL"
    title: string
    description: string
    imageUrl: string
  }
  
  export function BlogCard({ date, category, title, description, imageUrl }: BlogCardProps) {
    const categoryColors: Record<BlogCardProps["category"], string> = {
      NATURE: "text-[#5A8E00]",
      CULTURE: "text-[#5A8E00]",
      ADVENTURE: "text-[#5A8E00]",
      TRAVEL: "text-[#5A8E00]",
    }
  
    return (
      <article className="flex flex-col">
        <div className="rounded-2xl overflow-hidden mb-6">
          <img src={imageUrl || "/placeholder.svg"} alt="" className="w-full aspect-[4/3] object-cover bg-[#D9D9D9]" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <time className="text-sm text-[#666666]">{date}</time>
            <span className={`text-sm font-medium ${categoryColors[category]}`}>{category}</span>
          </div>
          <h3 className="text-2xl font-medium">{title}</h3>
          <p className="text-[#666666] leading-relaxed">{description}</p>
        </div>
      </article>
    )
  }
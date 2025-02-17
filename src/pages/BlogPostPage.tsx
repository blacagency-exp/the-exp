import { useParams } from "react-router-dom"
import { BlogPost } from "../Components/BlogPost/blog-post"
import { BaseLayout } from "../Components/layout/BaseLayout"
import { ExploreStories } from "../Components/BlogPost/explore-stories"
import img1 from "../assets/blogimg.png"
import img2 from "../assets/seblog.png"

const blogPosts = {
  "from-peaks-to-plains": {
    categories: ["TRAVEL", "ADVENTURE"],
    title: "From Peaks to Plains: A Journey Through Plateau's Landscape",
    date: "Oct 31, 2024",
    author: "Jeremiah Gyang",
    readTime: "12 min",
    mainImage: img1,
    secondaryImage: img2,
        sections: [
      {
        title: "Discover Plateau:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
      {
        title: "A journey through nature:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
    ],
    authorArticles: ["A journey through nature", "From peaks to plains", "A journey through nature"],
  },
  "from-peaks-to-plains-nature": {
    categories: ["NATURE", "TRAVEL"],
    title: "From Peaks to Plains: Nature's Wonders",
    date: "Oct 31, 2024",
    author: "Jeremiah Gyang",
    readTime: "10 min",
    mainImage: img1,
    secondaryImage:img2,
    sections: [
      {
        title: "Natural Wonders of Plateau:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
      {
        title: "Biodiversity Exploration:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
    ],
    authorArticles: [
      "Biodiversity Exploration",
      "Natural Wonders of Plateau",
      "From Peaks to Plains: Nature's Wonders",
    ],
  },
  "from-peaks-to-plains-culture": {
    categories: ["CULTURE", "TRAVEL"],
    title: "From Peaks to Plains: Cultural Odyssey",
    date: "Oct 31, 2024",
    author: "Jeremiah Gyang",
    readTime: "11 min",
    mainImage: img1,
    secondaryImage: img2,
    sections: [
      {
        title: "Cultural Heritage of Plateau:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
      {
        title: "Traditional Practices and Modern Life:",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      },
    ],
    authorArticles: [
      "Cultural Heritage of Plateau",
      "Traditional Practices and Modern Life",
      "From Peaks to Plains: Cultural Odyssey",
    ],
  },
  // Add entries for the remaining blog posts...
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    return <div>Blog post not found</div>
  }

  return (
    <BaseLayout>
      <BlogPost {...post} />
      <ExploreStories />
    </BaseLayout>
  )
}


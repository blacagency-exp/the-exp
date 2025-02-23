"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import type { BlogSection, TextContent, ListContent } from "../../types/blog"
import img1 from '../../assets/author_img.png'
import { SubscribeForm } from "../SubscribeForm"
import { LearnMoreModal } from "../LearnMoreModal"

export interface BlogPostProps {
  categories: string[]
  title: string
  date: string
  author: string
  readTime: string
  mainImage: string
  secondaryImage?: string
  sections: BlogSection[]
  authorArticles: string[]
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

const RichContent = ({ content }: { content: TextContent | ListContent | string }) => {
  if (typeof content === "string") {
    return <p className="text-gray-600 leading-relaxed font-light text-sm mb-4">{content}</p>
  }

  if ("items" in content) {
    const ListTag = content.type === "number" ? "ol" : "ul"
    return (
      <ListTag className={`ml-6 mb-4 ${content.type === "number" ? "list-decimal" : "list-disc"}`}>
        {content.items.map((item, index) => (
          <li key={index} className="text-gray-600 leading-relaxed font-light text-sm mb-2">
            {item}
          </li>
        ))}
      </ListTag>
    )
  }

  if (content.type === "emphasis") {
    return <p className="text-gray-800 font-medium text-sm mb-4 italic">{content.text}</p>
  }

  return <p className="text-gray-600 leading-relaxed font-light text-sm mb-4">{content.text}</p>
}

export function BlogPost({
  categories,
  title,
  date,
  author,
  readTime,
  mainImage,
  secondaryImage,
  sections = [],
  authorArticles,
}: BlogPostProps) 



{

  const [isModalOpen, setIsModalOpen] = useState(false)

 

  const handleLearnMore = () => {
    setIsModalOpen(true)
  }
  return (
    <section className="py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${styles.section.container}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {categories.map((category) => (
              <span key={category} className="px-6 py-2 text-xs font-medium rounded-lg bg-[#ECFFD0] text-[#82CF00]">
                {category}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-semibold text-black mb-6">
            {title}
          </motion.h1>

          {/* Meta information */}
          <motion.div
            variants={itemVariants}
            className="flex items-center px-4 py-2 gap-4 text-sm rounded-lg text-gray-600 mb-16 border-2 border-[#97E12B] w-[350px]"
          >
            <span>{date}</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src={img1} alt={author} className="w-full h-full object-cover" />
              </div>
              <span>{author}</span>
            </div>
            <span>{readTime}</span>
          </motion.div>
        </div>

        {/* Featured Image */}
        <motion.div variants={itemVariants} className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-12">
          <img
            src={mainImage || "/placeholder.svg"}
            alt="Featured image"
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h2 className="text-3xl font-medium mb-6">{section.title}</h2>
                {Array.isArray(section.content) ? (
                  section.content.map((content, contentIndex) => <RichContent key={contentIndex} content={content} />)
                ) : (
                  <RichContent content={section.content} />
                )}
                {index === 1 && secondaryImage && (
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-8">
                    <img
                      src={secondaryImage || "/placeholder.svg"}
                      alt="Secondary image"
                      className="w-full h-[500px] object-cover rounded-xl"
                    />
                    <p className="text-sm text-gray-500 mt-2">Image Caption</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Author Articles and Subscribe Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-2 gap-16"
          >
            {/* Other Articles */}
            <motion.div variants={itemVariants} className="p-6 rounded-lg border-[#97E12B] border-2">
              <div className="flex items-center gap-6 mb-4">
                <h3 className="text-lg font-semibold">Other Articles by</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src={img1} alt={author} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[#9FE870]">{author}</span>
                </div>
              </div>
              <ul className="space-y-3">
                {authorArticles.map((article, index) => (
                  <li key={index}>
                    <a href="#" className="text-black hover:text-[#9FE870] border-b border-gray-300">
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Stay Updated */}
             {/* Stay Updated */}
             <SubscribeForm onLearnMore={handleLearnMore} />




          </motion.div>
        </div>
      </motion.div>
      <LearnMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}


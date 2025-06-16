"use client"

import { styles } from "../../constants/styles"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { previewTours } from "../../data/tour-data"
import img1 from "../../assets/wildlife.jpg"

// Define the tags for each preview tour
const tourTags = {
  2: ["Coming Soon", "Wildlife", "Nature"],
  3: ["Coming Soon", "Mountains", "Hiking"],
  4: ["Coming Soon", "Waterfall", "Nature"],
}

// Define the preview images for each tour
const tourImages = {
  2:img1,
  3: img1,
  4: img1,
}

export function ComingSoonTours() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // Function to navigate to the preview tour
  const handleTourClick = (tourId: number) => {
    navigate(`/virtual-tour/${tourId}?scene=1&preview=true`)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  }

  const tagContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  }

  const tagVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  }

  return (
    <motion.section
      className="w-full py-12 md:py-24 bg-gray-50"
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className={`${styles.section.container} text-left px-4 md:px-6`}>
        <motion.div className="mb-12" variants={itemVariants}>
          <motion.h2
            className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] leading-[1.1] md:leading-[1] font-bold text-black mb-2 md:mb-4"
            variants={itemVariants}
          >
            Coming Soon
          </motion.h2>
          <motion.p className="text-base md:text-xl text-gray-400 max-w-2xl" variants={itemVariants}>
            Get a sneak peek of our upcoming virtual tours. Be the first to explore these amazing locations.
          </motion.p>
        </motion.div>

        {/* Preview Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewTours.map((tour) => (
            <motion.div
              key={tour.id}
              className="space-y-4 cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleTourClick(tour.id)}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src={tourImages[tour.id as keyof typeof tourImages]}
                  alt={tour.title}
                  className="w-full h-[250px] object-cover"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.5 },
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                  <div className="bg-[#1A2E0D]/80 px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                    <Clock size={16} className="text-[#97E12B]" />
                    <span className="text-white font-medium">Preview Available</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-[#FF9800] px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle size={14} className="text-white" />
                    <span className="text-white text-xs font-medium">Coming Soon</span>
                  </div>
                </div>
              </div>
              <motion.div className="flex flex-wrap gap-2" variants={tagContainerVariants}>
                {tourTags[tour.id as keyof typeof tourTags].map((tag) => (
                  <motion.span
                    key={tag}
                    className={`px-3 py-1 text-xs md:text-sm rounded-full ${
                      tag === "Coming Soon" ? "bg-[#FF9800] text-white" : "bg-[#97E12B] text-[#1A2E0D]"
                    }`}
                    variants={tagVariants}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <motion.h3 className="text-xl md:text-2xl font-bold text-black" variants={itemVariants}>
                  {tour.title}
                </motion.h3>
                <motion.p className="text-sm md:text-md text-[#4F4F4F] font-light" variants={itemVariants}>
                  {tour.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

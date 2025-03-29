"use client"

import { styles } from "../../constants/styles"
import shere from "../../assets/shereHills.png"
import { useNavigate } from "react-router-dom"
import hotspotIcon from "../../assets/hotspot-icon.png"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface Hotspot {
  id: string
  position: { x: number; y: number } // Position in percentages (e.g., { x: 50, y: 50 })
  targetTourId: number // ID of the target tour to navigate to
  icon?: string
}
// Define the TourCard interface
interface TourCard {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  videoUrl: string
  hotspots?: Hotspot[] // Add videoUrl to the TourCard interface
}

// Export tourData so it can be used in other files
export const tourData: TourCard[] = [
  {
    id: 1,
    title: "Shere Hills",
    description: "Explore the stunning Shere Hills with its rugged terrain",
    image: shere,
    tags: ["Virtual tour", "Rock Climbing", "Sailing"],
    videoUrl: "https://www.youtube.com/embed/_XoQ31Y6iAE",
    hotspots: [
      { id: "to-assop", position: { x: 30, y: 70 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 70, y: 70 }, targetTourId: 3, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 50, y: 70 }, targetTourId: 4, icon: hotspotIcon },
    ],
  },
  {
    id: 2,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls",
    image: shere,
    tags: ["Virtual tour", "Hiking", "Photography"],
    videoUrl: "https://www.youtube.com/embed/U2makrXtxoI",
    hotspots: [
      { id: "to-shere", position: { x: 20, y: 80 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 80, y: 20 }, targetTourId: 3, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 60, y: 40 }, targetTourId: 4, icon: hotspotIcon },
    ],
  },
  {
    id: 3,
    title: "Rayfield Resort",
    description: "Relax at the beautiful Rayfield Resort",
    image: shere,
    tags: ["Virtual tour", "Luxury", "Resort"],
    videoUrl: "https://www.youtube.com/embed/2zBDneZUgJM",
    hotspots: [
      { id: "to-shere", position: { x: 25, y: 75 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-assop", position: { x: 75, y: 25 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-wildlife", position: { x: 50, y: 50 }, targetTourId: 4, icon: hotspotIcon },
    ],
  },
  {
    id: 4,
    title: "Wildlife Park",
    description: "Discover the diverse wildlife of Plateau State",
    image: shere,
    tags: ["Virtual tour", "Animals", "Nature"],
    videoUrl: "https://www.youtube.com/embed/WVw2d42GLK8",
    hotspots: [
      { id: "to-shere", position: { x: 40, y: 60 }, targetTourId: 1, icon: hotspotIcon },
      { id: "to-assop", position: { x: 60, y: 40 }, targetTourId: 2, icon: hotspotIcon },
      { id: "to-rayfield", position: { x: 40, y: 20 }, targetTourId: 3, icon: hotspotIcon },
    ],
  },
]

export function FeaturedTours() {
  const featuredTour = tourData[0]
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
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

  const hintVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.6,
      },
    },
  }

  return (
    <motion.section
      className="w-full py-12 md:py-24"
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className={`${styles.section.container} text-left px-4 md:px-6`}>
        {" "}
        {/* Ensuring left alignment with proper padding */}
        <motion.h2
          className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[7rem] leading-[1.1] md:leading-[1] font-bold text-black mb-2 md:mb-4"
          variants={itemVariants}
        >
          Featured Tour
        </motion.h2>
        <motion.p className="text-base md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-16" variants={itemVariants}>
          Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
        </motion.p>
        {/* Single Featured Tour Card */}
        <motion.div className="w-full md:max-w-2xl" variants={cardVariants}>
          <motion.div
            className="space-y-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/virtual-tour/${featuredTour.id}`)}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <motion.div className="overflow-hidden rounded-2xl md:rounded-[2rem]" variants={imageVariants}>
              <motion.img
                src={featuredTour.image || "/placeholder.svg"}
                alt={featuredTour.title}
                className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.5 },
                }}
              />
            </motion.div>
            <motion.div className="flex flex-wrap gap-2" variants={tagContainerVariants}>
              {featuredTour.tags.map((tag) => (
                <motion.span
                  key={tag}
                  className="px-3 py-1 text-xs md:text-sm bg-[#97E12B] text-[#1A2E0D] rounded-full"
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
                {featuredTour.title}
              </motion.h3>
              <motion.p className="text-sm md:text-md text-[#4F4F4F] font-light" variants={itemVariants}>
                {featuredTour.description}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Navigation hint */}
        <motion.div className="mt-6 md:mt-8 text-gray-500 text-sm md:text-base" variants={hintVariants}>
          <motion.p
            animate={{
              opacity: [0.7, 1, 0.7],
              transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            Click the tour to explore more locations through hotspots
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}


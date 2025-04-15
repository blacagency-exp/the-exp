"use client"

import { styles } from "../../constants/styles"
import shere from "../../assets/shereHills.png"
import { useNavigate } from "react-router-dom"
import hotspotIcon from "../../assets/hotspot-icon.png"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

// Define a Scene interface for videos within a tour
interface Scene {
  id: number
  videoKey: string // S3 key for the video
  hotspots?: Hotspot[]
}

// Update the Hotspot interface to include timing information
interface Hotspot {
  id: string
  position: { x: number; y: number } // Position in percentages (e.g., { x: 50, y: 50 })
  targetSceneId: number // ID of the target scene to navigate to
  icon?: string
  startTime?: number // Time in seconds when the hotspot should appear
  endTime?: number // Time in seconds when the hotspot should disappear (optional)
}

// Define the TourCard interface
interface TourCard {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  scenes: Scene[] // Each tour has multiple scenes/videos
}

// Update the tourData to include scenes for the first tour
export const tourData: TourCard[] = [
  {
    id: 1,
    title: "Rayfield Resort",
    description: "Explore the stunning Shere Hills with its rugged terrain",
    image: shere,
    tags: ["Virtual tour", "Jet Ski", "Scenic Environment"],
    scenes: [
      {
        id: 1,
        videoKey: "tours/1/main.mp4",
        hotspots: [
          {
            id: "to-scene-2",
            position: { x: 42, y: 58 },
            targetSceneId: 2,
            icon: hotspotIcon,
            startTime: 17, // Appears after 5 seconds
            // Disappears after 30 seconds (optional)
          },
        ],
      },
      {
        id: 2,
        videoKey: "tours/2/main.mp4",
        hotspots: [
          {
            id: "back-to-scene-1",
            position: { x: 70, y: 70 },
            targetSceneId: 1,
            icon: hotspotIcon,
            startTime: 17, // Appears after 3 seconds
            // Disappears after 30 seconds
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Assop Falls",
    description: "Experience the magnificent Assop Falls",
    image: shere,
    tags: ["Virtual tour", "Hiking", "Photography"],
    scenes: [
      {
        id: 1,
        videoKey: "tours/3/main.mp4",
        hotspots: [],
      },
    ],
  },
  {
    id: 3,
    title: "Rayfield Resort",
    description: "Relax at the beautiful Rayfield Resort",
    image: shere,
    tags: ["Virtual tour", "Luxury", "Resort"],
    scenes: [
      {
        id: 1,
        videoKey: "tours/4/main.mp4",
        hotspots: [],
      },
    ],
  },
  {
    id: 4,
    title: "Wildlife Park",
    description: "Discover the diverse wildlife of Plateau State",
    image: shere,
    tags: ["Virtual tour", "Animals", "Nature"],
    scenes: [
      {
        id: 1,
        videoKey: "tours/5/main.mp4",
        hotspots: [],
      },
    ],
  },
]

export function FeaturedTours() {
  const featuredTour = tourData[0]
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // Function to navigate to the tour with the first scene specified
  const handleTourClick = () => {
    // Navigate to the tour with sceneId=1 explicitly specified
    navigate(`/virtual-tour/${featuredTour.id}?scene=1`)
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
            onClick={handleTourClick}
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


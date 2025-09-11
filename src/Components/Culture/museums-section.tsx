"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/muse-one.png"
import img2 from "../../assets/muse-two.png"

const museums = [
  {
    id: 1,
    name: "Jos Museum",
    description:
      "Take a virtual tour through the stunning 1950s villa, where you'll explore the vast heritage of Jos's rich history, complete with a collection of Nok terracotta sculptures.",
    image: img1,
  },
  {
    id: 2,
    name: "Museum of Traditional Nigerian Architecture",
    description:
      "Discover the charm of a 1950s villa brought to life in an immersive virtual tour. Explore Jos’s vibrant history and be captivated by the iconic Nok terracotta sculptures that showcase Nigeria’s timeless heritage.",
    image: img2,
  },
]

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
      duration: 0.5,
    },
  },
}

export function MuseumsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className={`${styles.section.container} px-4 sm:px-6 md:px-8`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-8 sm:mb-12 md:mb-16"
        >
          Museums & Art Galleries
        </motion.h2>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative md:h-[800px]">
          {museums.map((museum, index) => (
            <motion.div
              key={museum.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group 
                ${
                  index === 0
                    ? "mb-6 sm:mb-8 md:mb-0 md:absolute md:left-0 md:top-0 md:w-[calc(50%-12px)]"
                    : "md:absolute md:right-0 md:top-32 md:w-[calc(50%-12px)]"
                }
              `}
            >
              <div className="aspect-[4/3]">
                <img
                  src={museum.image || "/placeholder.svg"}
                  alt={museum.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-medium mb-2">{museum.name}</h3>
                  <p className="text-white/80 text-xs sm:text-sm max-w-xl font-light">{museum.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


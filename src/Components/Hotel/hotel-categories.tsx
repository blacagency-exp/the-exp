"use client"

import { motion, Variants } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from '../../assets/hotelroom.png'

const categories = [
  {
    title: "Luxury Hotels and Resorts",
    description: "Indulge in unrivalled comfort and world-class amenities with our premium hotels.",
    image:
      img1,
  },
  {
    title: "Budget-Friendly Stays",
    description:
      "Traveling on a budget? Discover comfortable and affordable options that provide all life essentials for a great stay without breaking the bank.",
    image:
      img1,
  },
  {
    title: "Family-Friendly Lodges",
    description:
      "Traveling with family? Choose accommodations that offer spacious rooms, kid-friendly amenities, and activities that everyone will enjoy.",
    image:
      img1,
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function HotelCategories() {
  return (
    <section className="bg-[#1B2E02] py-24">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold text-white text-center mb-16"
        >
          Top Hotel Categories
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="group cursor-pointer"
            >
              <div className=" rounded-3xl overflow-hidden">
                <div className="relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-[550px] h-[450px] object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0  rounded-3xl transition-opacity duration-300 group-hover:opacity-30" />
                </div>
                <div className="p-6">
                  <h3 className="text-[#97E12B] text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-white/80 text-md font-light">{category.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


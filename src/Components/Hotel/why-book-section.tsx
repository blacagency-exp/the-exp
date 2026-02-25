"use client"

import { motion, Variants } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/flexible.png"
import img2 from "../../assets/secure.png"
import img3 from "../../assets/chat.png"

const features = [
  {
    icon: img1,
    title: "Flexible Payments",
    description: "Choose from a variety of payment options tailored to your convenience.",
  },
  {
    icon: img2,
    title: "Secure Bookings",
    description:
      "Each property has been vetted for security and reliability to give you peace of mind during your stay.",
  },
  {
    icon: img3,
    title: "Personalized Support",
    description:
      "Need help deciding? Our team is here to guide you in selecting accommodations that match your preferences, budget, and travel needs.",
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

export function WhyBookSection() {
  return (
    <section className="bg-[#1B2E02] py-24">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
        >
          Why Book Your Stay With Us?
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[#5A8E00] rounded-2xl p-8 transition-shadow hover:shadow-lg hover:shadow-[#97E12B]/20"
            >
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 mb-6">
                  <img
                    src={feature.icon || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-white text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-[#97E12B] font-normal text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


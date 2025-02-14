"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"

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

export function AuthorSection() {
  return (
    <section className="py-12">
      <div className={`${styles.section.container} max-w-7xl mx-auto`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Author Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-[#9FE870] p-8 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mbrIZiKshPByDA7ajKudvkuK8KomeU.png"
                alt="Jeremiah Gyang"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#9FE870]">Jeremiah Gyang</h3>
          </motion.div>

          {/* Action Card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-[#9FE870] p-8 flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-[#9FE870] text-black rounded-lg font-medium"
            >
              Subscribe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-[#9FE870] text-black rounded-lg font-medium"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


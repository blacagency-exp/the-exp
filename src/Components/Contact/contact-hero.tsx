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

export function ContactHero() {
  return (
    <section className="py-24">
      <div className={`${styles.section.container}`}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.span variants={itemVariants} className="text-[#9FE870] text-lg font-medium mb-4 block">
            CONTACT US
          </motion.span>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-[#0A1400] mb-12">
            We're here to help
          </motion.h1>

          <motion.form variants={containerVariants} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="text-gray-600 mb-2 block">Name</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full px-4 py-2 rounded-lg border border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full px-4 py-2 rounded-lg border border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-600 mb-2 block">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-gray-600 mb-2 block">Comment</label>
              <textarea
                placeholder="Write your message here"
                rows={8}
                className="w-full px-4 py-2 rounded-lg border border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all resize-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="px-8 py-2 bg-[#0A1400] text-white rounded-lg hover:bg-[#0A1400]/90 transition-colors"
              >
                Submit
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}


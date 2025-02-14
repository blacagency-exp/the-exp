"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from '../../assets/lady.png'

export function GuideOfMonth() {
  return (
    <section className="py-24">
      <div className={`${styles.section.container}`}>
        <div className="grid md:grid-cols-2 gap-0 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={img1}
              alt="Guide of the Month"
              className="w-[500px] h-[550px] rounded-3xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-7xl font-semibold text-black leading-10">
              Our guide of
              <br />
              the month
            </h2>
            <p className="text-gray-600 font-light text-md">
              This month, we're thrilled to spotlight Sarah Dung as our Guide of the Month! With over eight years of
              experience guiding travelers through Plateau State, Sarah has a unique talent for bringing local culture
              to life.
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-[#97E12B] hover:bg-[#86CC25] text-[#1B2E02] rounded-md transition-colors"
              >
                Learn more
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 border-2 border-[#97E12B] text-[#1B2E02] hover:bg-[#97E12B]/5 rounded-md transition-colors"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


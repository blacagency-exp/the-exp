"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"

export function TextSection() {
  return (
    <section id="text-section" className="w-full bg-white">
      <div className={`${styles.section.container} py-24`}>
        <div className="flex flex-col justify-center lg:block">
          <motion.div
            className="relative lg:text-left text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] leading-[0.95] tracking-[-0.02em] text-[#141E03] font-semibold"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Experience
              <br />
              Plateau.
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-[#97E12B] max-w-md lg:absolute lg:bottom-[0.5em] lg:left-[32.5em] font-normal mx-auto lg:mx-0 mt-4 lg:mt-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              From scenic mountains to vibrant festivals, explore Nigeria's natural paradise.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


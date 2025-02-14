"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"

export function HeroSection() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className={styles.section.container}>
        <div className="flex flex-col space-y-12 py-12 lg:py-16">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-[5rem] sm:text-[7rem] md:text-[8rem] lg:text-[12rem] leading-[0.95] tracking-[-0.02em] text-[#141E03] font-semibold"
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
              className="text-xl sm:text-2xl text-[#5A8E00] max-w-md absolute bottom-[0.5em] left-[32.5em] font-normal"
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


"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/phone.png"
import img2 from "../../assets/chatt.png"

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

export function GetInTouch() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#0A1400]">
      <div className={`${styles.section.container} px-4 sm:px-6 md:px-8`}>
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4"
          >
            Get in touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-base sm:text-lg"
          >
            Got questions, we've got answers
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#5A8E00] rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer h-auto sm:h-[300px]"
          >
            <img
              src={img1 || "/placeholder.svg"}
              alt="Phone icon"
              className="w-10 h-10 sm:w-14 sm:h-14 mb-4 sm:mb-6 object-contain"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-white">Speak with customer care</h3>
            <p className="text-white text-base sm:text-xl font-normal">
              Get personalized assistance by connecting with our friendly support team.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#5A8E00] rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer h-auto sm:h-[300px]"
          >
            <img
              src={img2 || "/placeholder.svg"}
              alt="Chat icon"
              className="w-10 h-10 sm:w-14 sm:h-14 mb-4 sm:mb-6 object-contain"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-white">Chat to us directly</h3>
            <p className="text-white text-base sm:text-xl font-normal">
              Have questions? Start a live chat for quick answers and support.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


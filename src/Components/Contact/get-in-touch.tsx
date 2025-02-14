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
    <section className="py-24 bg-[#0A1400]">
      <div className={`${styles.section.container}`}>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Get in touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Got questions, we've got answers
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#5A8E00] rounded-3xl p-8 cursor-pointer h-[300px]"
          >
            <img src={img1 || "/placeholder.svg"} alt="Phone icon" className="w-14 h-14 mb-6 object-contain" />
            <h3 className="text-2xl font-semibold mb-4">Speak with customer care</h3>
            <p className="text-white text-xl font-normal">
              Get personalized assistance by connecting with our friendly support team.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-[#5A8E00] rounded-3xl p-8 cursor-pointer"
          >
            <img src={img2 || "/placeholder.svg"} alt="Chat icon" className="w-14 h-14 mb-6 object-contain" />
            <h3 className="text-2xl font-semibold mb-4">Chat to us directly</h3>
            <p className="text-white text-xl font-normal">
              Have questions? Start a live chat for quick answers and support.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


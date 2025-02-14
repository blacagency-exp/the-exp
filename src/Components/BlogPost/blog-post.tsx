"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/blogimg.png"
import img2 from "../../assets/seblog.png"

const categories = ["TRAVEL", "CULTURE", "ADVENTURE", "TOURISM"]

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

export function BlogPost() {
  return (
    <section className="py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${styles.section.container}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-6">
            {categories.map((category) => (
              <span
                key={category}
                className="px-6 py-2 text-xs font-medium rounded-lg bg-[#ECFFD0] text-[#82CF00]"
              >
                {category}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-semibold text-black mb-6">
            Discover Plateau: A Journey Through Nature, Culture, and Adventure
          </motion.h1>

          {/* Meta information */}
          <motion.div variants={itemVariants} className=" flex items-center px-4 py-2 gap-4 text-sm rounded-lg text-gray-600 mb-16 border-2 border-[#97E12B] w-[350px]">
            <span>July 15, 1999</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src="/placeholder.svg" alt="Jeremiah Gyang" className="w-full h-full object-cover" />
              </div>
              <span>Jeremiah Gyang</span>
            </div>
            <span>12 min</span>
          </motion.div>
        </div>

        {/* Featured Image - full width */}
        <motion.div variants={itemVariants} className="relative w-full aspect-[16/9] rounded-xl overflow-hidden ">
          <img
            src={img1 || "/placeholder.svg"}
            alt="Mountain landscape with waterfall"
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-medium mb-4">Discover Plateau:</h2>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-medium mb-4">A journey through nature:</h2>
              <p className="text-gray-600 leading-relaxed mb-8 font-light text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Et cursus elit curabitur. Lobortis non porttitor, amet id nulla eu tellus
                porttitor amet amet et elit. Nam non tempus molestie ut libero et aliquet magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                <img
                  src={img2 || "/placeholder.svg"}
                  alt="Paragliding over water"
                  className="w-full h-[500px] object-cover rounded-xl"
                />
                <p className="text-sm text-gray-500 mt-2">Image Caption</p>
              </div>

              <h2 className="text-3xl font-medium mb-4">A journey through nature:</h2>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
            </motion.div>
          </div>

          {/* Horizontal Line */}
          <div className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="w-full h-px bg-[#0A1400] my-16" />
          </div>

          {/* Author Articles and Subscribe Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-2 gap-16"
          >
            {/* Other Articles */}
            <motion.div variants={itemVariants} className="p-6 rounded-lg  border-[#97E12B] border-2">
              <div className="flex items-center gap-6 mb-4">
                <h3 className="text-lg font-semibold">Other Articles by</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img src="/placeholder.svg" alt="Jeremiah Gyang" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[#9FE870]">Jeremiah Gyang</span>
                </div>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-black hover:text-[#9FE870] border-b border-gray-300">
                    A journey through nature
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-[#9FE870] border-b border-gray-300">
                    From peaks to plains
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black hover:text-[#9FE870] border-b border-gray-300">
                    A journey through nature
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Stay Updated */}
            <motion.div variants={itemVariants} className="p-6 rounded-lg border-2 border-[#97E12B]">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Subscribe to our blog for the latest travel tips and cultural insights about Plateau State.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#97E12B] text-black rounded-lg hover:bg-[#8ED060] transition-colors">
                  Subscribe
                </button>
                <button className="px-4 py-2 bg-[#97E12B] text-black rounded-lg hover:bg-[#97E12B] transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}


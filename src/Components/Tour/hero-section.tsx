"use client"

import { motion } from "framer-motion"
import { Search, ChevronDown } from "lucide-react"
import { useState } from "react"
import { styles } from "../../constants/styles"

export function HeroSection() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <section className="py-24">
      <div className={`${styles.section.container}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-[2.75rem] font-bold text-[#1B2E02] mb-4">Your travel partner</h1>
          <p className="text-lg text-[#5A8E00]">
            Our local guides are passionate, knowledgeable, and specializes in different areas, whether you're looking
            for a nature trek, cultural insights, or culinary exploration.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="flex bg-[#E8FFCC] rounded-full">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-12 px-6 py-5 hover:bg-[#97E12B]/20 transition-colors rounded-full flex items-center gap-2"
              >
                Filter
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="w-px bg-[#97E12B]/30 my-3" />

              <div className="flex-1 flex items-center pr-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-full bg-transparent px-6 py-5 focus:outline-none"
                />
                <button className="h-9 px-6 bg-[#5A8E00] hover:bg-[#4A7500] text-white rounded-full flex items-center gap-2 transition-colors">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Filter Dropdown */}
            <motion.div
              initial={false}
              animate={
                isFilterOpen
                  ? {
                    opacity: 1,
                    y: 0,
                    display: "block",
                  }
                  : {
                    opacity: 0,
                    y: -20,
                    transitionEnd: {
                      display: "none",
                    },
                  }
              }
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 bg-white shadow-lg rounded-2xl p-4 min-w-[200px] z-10"
            >
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-2 hover:bg-[#E8FFCC] rounded-lg transition-colors">
                  Specialty
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-[#E8FFCC] rounded-lg transition-colors">
                  Language
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-[#E8FFCC] rounded-lg transition-colors">
                  Rating
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


"use client"

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/enoch.jpg"

interface InvestmentCard {
  title: string
  image?: string
  buttonText: string
  isFeature?: boolean
}

const investmentCards: InvestmentCard[] = [
  {
    title: "Soccer partnership",
    image: img1,
    buttonText: "View more",
    isFeature: true,
  },
  {
    title: "Tourism and Hospitality Partners",
    buttonText: "Read More",
  },
  {
    title: "Cultural and Event Sponsorships",
    buttonText: "Read more",
  },
  {
    title: "Local Businesses and Vendors",
    buttonText: "Read More",
  },
  {
    title: "Media and Content Collaboration",
    buttonText: "Read More",
  },
]

export function InvestmentSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <section ref={sectionRef} className="w-full bg-white py-12 lg:py-24">
      <div className={`${styles.section.container} px-4 lg:px-0`}>
        <motion.div
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="space-y-4 max-w-2xl mb-6 lg:mb-0">
            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-[5rem] leading-none tracking-tight text-[#1A2E0D] font-semibold"
            >
              Investment
            </motion.h2>
            <div className="space-y-2">
              <motion.h3 variants={itemVariants} className="text-2xl lg:text-4xl font-semibold text-[#141414]">
                Grow your business
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-[#666666] text-md lg:text-lg leading-relaxed font-normal"
              >
                Join us in promoting Plateau State's unique culture, landscapes, and opportunities for sustainable
                tourism.
              </motion.p>
            </div>
          </div>
          <motion.button
            variants={itemVariants}
            className="flex font-medium items-center gap-2 px-6 lg:px-8 py-2 bg-[#E7FBD0] text-[#5A8E00] rounded-full hover:bg-[#E7FBD0]/80 transition-colors w-fit lg:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View more
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Featured Card */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-[684px] relative rounded-3xl overflow-hidden h-[300px] lg:h-[520px]"
          >
            <img src={img1 || "/placeholder.svg"} alt="Soccer team" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 p-4 lg:p-8">
                <h4 className="text-white text-2xl lg:text-3xl font-semibold mb-4">{investmentCards[0].title}</h4>
                <motion.button
                  className="bg-white text-[#5A8E00] px-6 lg:px-24 py-2 lg:py-3 rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors text-sm lg:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {investmentCards[0].buttonText}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Grid Cards */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {investmentCards.slice(1).map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#D9D9D9] rounded-3xl p-6 lg:p-12 flex flex-col items-center justify-center text-center"
              >
                <h4 className="text-lg lg:text-[21px] text-[#1A2E0D] mb-4 font-bold">{card.title}</h4>
                <motion.button
                  className="bg-white text-[#5A8E00] px-4 lg:px-6 py-2 lg:py-3 rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors text-xs lg:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {card.buttonText}
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


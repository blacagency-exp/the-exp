"use client"

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { styles } from "../../constants/styles"
import featuredEventImage from "../../assets/event.jpg"

export function FeaturedEvent() {
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
              Featured Event
            </motion.h2>
            <div className="space-y-2">
              <motion.h3 variants={itemVariants} className="text-2xl lg:text-4xl font-semibold text-[#141414]">
                Art Meet Fashion
              </motion.h3>
              <motion.p
                variants={itemVariants}
                className="text-[#666666] text-md lg:text-lg leading-relaxed font-normal"
              >
                Art Meets Fashion held at the prestigious yaradua center in abuja and headline by the  guodo material is
                testiment of the treasurs in northan nigeria and plateau state
              </motion.p>
            </div>
          </div>
          <motion.button
            variants={itemVariants}
            className="flex font-medium items-center gap-2 px-6 lg:px-8 py-2 bg-[#E7FBD0] text-[#5A8E00] rounded-full hover:bg-[#D9F99D] transition-colors w-fit lg:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View more
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="w-full relative rounded-3xl overflow-hidden">
            <img
              src={featuredEventImage || "/placeholder.svg"}
              alt="Art Meets Fashion Event"
              className="w-full h-auto object-cover rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


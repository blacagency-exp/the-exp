"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { styles } from "../../constants/styles"
import img1 from "../../assets/headset.png"

export function HeroSection() {
  // Text animation variants
  const headingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const paragraphVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, delay: 0.6 },
    },
  }

  const buttonVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  }

  const arrowVariants = {
    initial: { y: 0 },
    hover: {
      y: [0, 5, 0],
      transition: { duration: 0.6, repeat: Number.POSITIVE_INFINITY },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, delay: 0.3 },
    },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="w-full bg-white relative">
      <div className={styles.section.container}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 pb-12">
          <div className="max-w-xl flex flex-col items-center md:items-start">
            <motion.h1
              className="space-y-4 text-center md:text-left"
              variants={headingVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className="block text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[8.6rem] leading-[1] font-light text-[#1A2E0D]"
                variants={textVariants}
              >
                Visit
                <br />
                Plateau
              </motion.span>
              <motion.span
                className="block text-[3.2rem] sm:text-[4.8rem] md:text-[5.8rem] lg:text-[8.2rem] leading-[1] font-bold text-[#1A2E0D]"
                variants={textVariants}
              >
                at Home.
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-md mb-6 mt-4 text-center md:text-left px-4 md:px-0"
              variants={paragraphVariants}
              initial="hidden"
              animate="visible"
            >
              Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
            </motion.p>

            {/* Mobile button (hidden on md and up) */}
            <motion.div
              className="w-full flex justify-center md:hidden mt-4"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <button className="flex flex-row justify-center items-center px-6 py-2 gap-2 w-[280px] h-[42px] bg-[#5A8E00] rounded-[40px] text-white hover:bg-[#4A7D00] transition-colors whitespace-nowrap">
                Start your Virtual Tour
                <motion.div variants={arrowVariants}>
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              </button>
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center items-center mt-8 md:mt-0"
            variants={imageVariants}
            initial="hidden"
            animate={["visible", "float"]}
          >
            <img
              src={img1 || "/placeholder.svg"}
              alt="Person wearing VR headset"
              className="w-full max-w-[80%] md:max-w-full h-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Desktop button with absolute positioning (hidden on mobile, visible on md and up) */}
      <motion.div
        className="hidden md:block"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <button className="flex flex-row justify-center items-center px-6 py-2 gap-2 absolute w-[280px] h-[42px] left-[calc(50%-333px/2+26.5px)] top-[550px] bg-[#5A8E00] rounded-[40px] text-white hover:bg-[#4A7D00] transition-colors whitespace-nowrap">
          Start your Virtual Tour
          <motion.div variants={arrowVariants}>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}


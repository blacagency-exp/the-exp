"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import img1 from "../../assets/travel-image.png"

export function Hero() {
  const controls = useAnimation()

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  const backgroundVariants = {
    hidden: { scale: 1.1 },
    visible: {
      scale: 1,
      transition: {
        duration: 10,
        ease: "easeOut",
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  const decorationVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${img1})`,
        }}
        initial="hidden"
        animate={controls}
        variants={backgroundVariants}
      >
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-5xl xs:text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] 
                     leading-tight sm:leading-none font-bold text-white text-center 
                     max-w-[90vw] sm:max-w-[15ch] md:max-w-[12ch] z-10
                     px-2 sm:px-0"
          initial="hidden"
          animate={controls}
          variants={textVariants}
        >
          Plan your Adventure
        </motion.h1>

        {/* Decorative SVG - Hidden on mobile for cleaner look */}
        <motion.svg
          className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-4 sm:left-6 md:left-10 
                     w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                     text-white opacity-30 sm:opacity-50 hidden xs:block"
          viewBox="0 0 100 100"
          initial="hidden"
          animate={controls}
          variants={decorationVariants}
        >
          <motion.path
            d="M10,50 Q25,25 50,50 T90,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            variants={decorationVariants}
          />
        </motion.svg>
      </div>
    </div>
  )
}

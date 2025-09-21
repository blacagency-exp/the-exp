"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useScroll, useTransform } from "framer-motion"
import { Camera, Sparkles } from "lucide-react"

export function GalleryHero() {
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  }

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#141E03] via-[#1A2A04] to-[#0F1502]"
      style={{ y, opacity }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#97E12B] rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Floating Icons */}
        <div className="absolute -top-20 left-1/4 hidden lg:block">
          <motion.div variants={iconVariants}>
            <Camera className="w-12 h-12 text-[#97E12B] opacity-60" />
          </motion.div>
        </div>
        <div className="absolute -top-16 right-1/3 hidden lg:block">
          <motion.div
            variants={iconVariants}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-8 h-8 text-[#97E12B] opacity-40" />
          </motion.div>
        </div>

        {/* Main Title */}
        <motion.h1
          variants={textVariants}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-white leading-none mb-8"
        >
          <span className="block">Visual</span>
          <span className="block text-[#97E12B] relative">
            Stories
            <motion.div
              className="absolute -inset-4 bg-[#97E12B] opacity-10 rounded-3xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={textVariants}
          className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Immerse yourself in the vibrant culture and breathtaking moments of Plateau State's most spectacular events
          and festivals
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div variants={textVariants} className="flex flex-col items-center space-y-4">
          <span className="text-[#97E12B] text-sm uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-[#97E12B] rounded-full flex justify-center"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              className="w-1 h-3 bg-[#97E12B] rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

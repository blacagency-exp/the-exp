"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation, Variants } from "framer-motion"
import { Camera, Users, Calendar, Award } from "lucide-react"

const stats = [
  {
    icon: Camera,
    number: 500,
    suffix: "+",
    label: "Photos Captured",
    description: "High-quality event photography",
  },
  {
    icon: Calendar,
    number: 50,
    suffix: "+",
    label: "Events Covered",
    description: "Festivals and cultural celebrations",
  },
  {
    icon: Users,
    number: 10000,
    suffix: "+",
    label: "People Reached",
    description: "Through our visual storytelling",
  },
  {
    icon: Award,
    number: 25,
    suffix: "+",
    label: "Awards Won",
    description: "Recognition for cultural preservation",
  },
]

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true)
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * target))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, target, duration, isVisible])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function GalleryStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-[#141E03] to-[#1A2A04] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#97E12B] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#97E12B] opacity-3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8 },
            },
          }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Impact in Numbers</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Preserving and celebrating the rich cultural heritage of Plateau State through visual storytelling
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center group">
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-20 h-20 mx-auto bg-[#97E12B] rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-2xl group-hover:shadow-[#97E12B]/25 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-[#141E03]" />
                </div>

                {/* Floating particles */}
                <motion.div
                  className="absolute -top-2 -right-2 w-3 h-3 bg-[#97E12B] rounded-full opacity-60"
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>

              <motion.div
                className="text-5xl md:text-6xl font-bold text-white mb-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </motion.div>

              <h3 className="text-xl font-semibold text-[#97E12B] mb-2">{stat.label}</h3>

              <p className="text-white/70 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        {/* <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-[#97E12B] text-[#141E03] font-semibold rounded-full hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Events
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  )
}

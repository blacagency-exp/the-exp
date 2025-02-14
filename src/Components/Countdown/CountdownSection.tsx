"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Info } from "lucide-react"
import { styles } from "../../constants/styles"
import React from "react"
import img1 from "../../assets/bg_count.jpg"
import { format } from "date-fns"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isCountdownOver, setIsCountdownOver] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const targetDate = new Date("2025-02-21").getTime()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setIsCountdownOver(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const numberVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const labelVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      },
    },
  }

  const formattedTargetDate = format(new Date(targetDate), "MMMM d, yyyy 'at' h:mm a")

  return (
    <section className="w-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#141E03]"
        style={{
          backgroundImage: `url(${img1})`,
          filter: "brightness(0.5)",
        }}
      />

      <div className="w-full min-h-screen flex items-center justify-center py-10 sm:py-20 px-4 relative z-10">
        <div className={`${styles.section.container}`}>
          <div className="flex flex-col items-center">
            <motion.h2
              className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-semibold text-white mb-6 sm:mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              COUNTDOWN TO THE EXPERIENCE
            </motion.h2>

            <AnimatePresence>
              {!isCountdownOver && (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-16 relative"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Object.entries(timeLeft).map(([unit, value], index) => (
                    <React.Fragment key={unit}>
                      <motion.div
                        className="flex flex-col items-center"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              delay: index * 0.1,
                            },
                          },
                        }}
                      >
                        <motion.span
                          className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-[#5A8E00] mb-1 sm:mb-2"
                          variants={numberVariants}
                        >
                          {value.toString().padStart(2, "0")}
                        </motion.span>
                        <motion.span
                          className="text-xs sm:text-sm md:text-base text-white/80 uppercase tracking-wider"
                          variants={labelVariants}
                        >
                          {unit}
                        </motion.span>
                      </motion.div>
                      {index < 3 && index % 2 === 1 && (
                        <div
                          className="hidden sm:block absolute h-16 sm:h-24 w-px bg-white/20 top-1/2 -translate-y-1/2"
                          style={{
                            left: `${(index + 1) * 25}%`,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {isCountdownOver ? (
              <motion.button
                className="flex items-center gap-2 bg-[#5A8E00] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full hover:bg-[#4A7D00] transition-colors mt-6 sm:mt-12 md:mt-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                EXPLORE THE CITY
                <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  className="flex items-center gap-2 text-[#5A8E00] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full cursor-not-allowed mt-6 sm:mt-12 md:mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  aria-describedby="tooltip"
                >
                  EXPLORE THE CITY
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      ref={tooltipRef}
                      id="tooltip"
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-white p-2 rounded-md shadow-lg text-xs sm:text-sm text-gray-700 w-48 sm:w-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      This button will be active on {formattedTargetDate}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


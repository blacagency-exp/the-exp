"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import React from "react"
import img1 from "../../assets/bg_count.jpg"
import newlogo from "../../assets/logo_white.png"

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
  const targetDate = new Date("2025-03-01").getTime()

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

  return (
    <section className="w-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#141E03]"
        style={{
          backgroundImage: `url(${img1})`,
          filter: "brightness(0.5)",
        }}
      />

      <div className="w-full min-h-screen flex flex-col items-center justify-center py-10 sm:py-20 px-4 relative z-10">
        <img
          src={newlogo || "/placeholder.svg"}
          alt="Logo"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-8 md:w-38 md:h-16 object-contain"
        />
        <div className={`${styles.section.container}`}>
          <div className="flex flex-col items-center">
            <motion.h2
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 sm:mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              COUNTDOWN TO THE PLATEAU EXPERIENCE
            </motion.h2>

            <AnimatePresence>
              {!isCountdownOver && (
                <motion.div
                  className="flex sm:grid sm:grid-cols-4 gap-2 sm:gap-6 md:gap-8 mb-8 sm:mb-16 relative"
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
                          className="text-lg sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-[#5A8E00] mb-0 sm:mb-2"
                          variants={numberVariants}
                        >
                          {value.toString().padStart(2, "0")}
                        </motion.span>
                        <motion.span
                          className="text-[10px] sm:text-sm md:text-base text-white/80 uppercase tracking-wider"
                          variants={labelVariants}
                        >
                          {unit}
                        </motion.span>
                      </motion.div>
                      {index < 3 && (
                        <>
                          <div className="flex items-center justify-center mx-1 sm:hidden">
                            <span className="text-white/50 text-lg">:</span>
                          </div>
                          <div
                            className="hidden sm:block absolute h-16 sm:h-24 w-px bg-white/20 top-1/2 -translate-y-1/2"
                            style={{
                              left: `${(index + 1) * 25}%`,
                            }}
                          />
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {isCountdownOver && (
              <motion.p
                className="text-xl sm:text-2xl text-white mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                The Plateau Experience has begun!
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


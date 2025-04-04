"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import React from "react"
import img1 from "../../assets/bg_count.jpg"
import newlogo from "../../assets/logo_white.png"
import { useNavigate } from "react-router-dom"

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
  const [showTransition, setShowTransition] = useState(false)
  const navigate = useNavigate()

  // Set target to 5pm today
  const getTargetDate = () => {
    const today = new Date()
    today.setHours(17, 0, 0, 0) // Set to 5:00:00 PM
    return today.getTime()
  }

  const targetDate = getTargetDate()

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

        // Start transition animation after countdown ends
        setTimeout(() => {
          setShowTransition(true)

          // Navigate to homepage after animation completes
          setTimeout(() => {
            navigate("/count")
          }, 3000) // Wait for 3 seconds after transition starts
        }, 1500) // Wait for 1.5 seconds after countdown ends
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, navigate])

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

  // Celebration particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    color: i % 3 === 0 ? "#5A8E00" : i % 3 === 1 ? "#FFD700" : "#FFFFFF",
  }))

  return (
    <section className="w-full relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#141E03]"
        style={{
          backgroundImage: `url(${img1})`,
          filter: "brightness(0.5)",
        }}
      />

      {/* Transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#141E03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.img
                  src={newlogo || "/placeholder.svg"}
                  alt="Logo"
                  className="w-64 md:w-80 h-auto object-contain"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{
                    duration: 1.8,
                    times: [0, 0.6, 1],
                    ease: "easeOut",
                  }}
                />
              </motion.div>

              {/* Animated particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: particle.color,
                    width: particle.size,
                    height: particle.size,
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0.8],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    ease: "easeOut",
                    times: [0, 0.4, 1],
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

            {isCountdownOver && !showTransition && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.p
                  className="text-xl sm:text-3xl text-white mb-4"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{
                    duration: 1.2,
                    times: [0, 0.6, 1],
                    ease: "easeOut",
                  }}
                >
                  The Plateau Experience has begun!
                </motion.p>
                <motion.p
                  className="text-base sm:text-xl text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Redirecting to the experience...
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


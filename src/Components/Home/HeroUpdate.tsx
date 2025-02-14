"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { styles } from "../../constants/styles"
import { useRef, useEffect } from "react"
import vid from "../../assets/realvid.mp4"

export function HeroUpdate() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const buttonVariants = {
    initial: { y: 50, opacity: 0 },
    animate: (isMobile: boolean) => ({
      y: isMobile ? 0 : -40,
      x: isMobile ? 0 : -160,
      opacity: 1,
      transition: { duration: 0.8, delay: 1.2 },
    }),
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const playVideo = () => {
        video.play().catch((error) => {
          console.error("Autoplay was prevented:", error)
        })
      }

      video.addEventListener("loadedmetadata", playVideo)
      video.addEventListener("canplay", playVideo)

      // Attempt to play immediately in case the video is already loaded
      playVideo()

      return () => {
        video.removeEventListener("loadedmetadata", playVideo)
        video.removeEventListener("canplay", playVideo)
      }
    }
  }, [])

  const smoothScroll = (target: HTMLElement, duration: number) => {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const run = ease(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function ease(t: number, b: number, c: number, d: number) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("text-section")
    if (nextSection) {
      smoothScroll(nextSection, 1000) // Adjust the duration (in ms) as needed
    }
  }

  return (
    <section className="relative w-full h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay loop muted playsInline preload="auto">
          <source src={vid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className={`${styles.section.container} relative z-10 h-full pt-24`}>
        <div className="flex flex-col justify-center h-full lg:block lg:pt-32 -mt-16 lg:mt-0">
          {/* Start Journey Button */}
          <motion.div
            className="lg:absolute relative mt-[490px] lg:mt-0 lg:bottom-12 lg:left-1/2 lg:transform lg:-translate-x-[160px] flex justify-center lg:block"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            custom={typeof window !== "undefined" && window.innerWidth < 1024}
          >
            <button  onClick={scrollToNextSection} className="bg-[#4D7C0F] font-medium hover:bg-[#3F6A0A] text-white px-8 lg:px-16 py-3 rounded-full text-base lg:text-lg flex items-center justify-center transition-colors">
              Start your journey
              <ArrowDown className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


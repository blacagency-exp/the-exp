"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { styles } from "../../constants/styles"
import { useRef, useEffect, useState } from "react"
import vid from "../../assets/realvid.mp4"

export function HeroUpdate() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const buttonVariants = {
    initial: { y: 50, opacity: 0 },
    animate: (isMobile: boolean) => ({
      y: isMobile ? 0 : -40,
      x: isMobile ? 0 : -160,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.5 }, // Reduced delay since we're now waiting for video
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

      const handleCanPlay = () => {
        setIsVideoLoading(false)
        playVideo()

        // Add a small delay before showing the button to ensure smooth transition
        setTimeout(() => {
          setIsVideoReady(true)
        }, 500)
      }

      // Track loading progress
      const handleProgress = () => {
        if (video.readyState >= 3) {
          // HAVE_FUTURE_DATA or higher
          setIsVideoLoading(false)

          // Add a small delay before showing the button to ensure smooth transition
          setTimeout(() => {
            setIsVideoReady(true)
          }, 500)
        }
      }

      video.addEventListener("loadedmetadata", handleProgress)
      video.addEventListener("canplay", handleCanPlay)
      video.addEventListener("progress", handleProgress)

      // Preload the video
      if (video.preload !== "auto") {
        video.preload = "auto"
      }

      // Attempt to play immediately in case the video is already loaded
      if (video.readyState >= 3) {
        setIsVideoLoading(false)
        playVideo()

        // Add a small delay before showing the button to ensure smooth transition
        setTimeout(() => {
          setIsVideoReady(true)
        }, 500)
      }

      return () => {
        video.removeEventListener("loadedmetadata", handleProgress)
        video.removeEventListener("canplay", handleCanPlay)
        video.removeEventListener("progress", handleProgress)
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
      {/* Video Background with Loading State */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-16 h-16 border-4 border-t-[#4D7C0F] border-opacity-50 rounded-full animate-spin"></div>
          </div>
        )}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoading ? "opacity-0" : "opacity-100"}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={vid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className={`${styles.section.container} relative z-10 h-full pt-24`}>
        <div className="flex flex-col justify-center h-full lg:block lg:pt-32 -mt-16 lg:mt-0">
          {/* Start Journey Button - Only animate after video is ready */}
          {isVideoReady && (
            <motion.div
              className="lg:absolute relative mt-[490px] lg:mt-0 lg:bottom-12 lg:left-1/2 lg:transform lg:-translate-x-[160px] flex justify-center lg:block"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              custom={typeof window !== "undefined" && window.innerWidth < 1024}
            >
              <button
                onClick={scrollToNextSection}
                className="bg-[#4D7C0F] font-medium hover:bg-[#3F6A0A] text-white px-8 lg:px-16 py-3 rounded-full text-base lg:text-lg flex items-center justify-center transition-colors"
              >
                Start your journey
                <ArrowDown className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}


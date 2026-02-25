"use client"

import { motion, Variants } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { styles } from "../../constants/styles"
import { useRef } from "react"
import vid from "../../assets/realvid.mp4"

export function HeroUpdate() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const buttonVariants: Variants = {
    initial: { y: 50, opacity: 0 },
    animate: (isMobile: boolean) => ({
      y: isMobile ? 0 : -40,
      x: isMobile ? 0 : -160,
      opacity: 1,
      transition: { duration: 0.8, delay: 1.2 },
    }),
  }

  return (
    <section className="relative w-full h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay loop muted playsInline>
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
            <button className="bg-[#4D7C0F] font-medium hover:bg-[#3F6A0A] text-white px-8 lg:px-16 py-3 rounded-full text-base lg:text-lg flex items-center justify-center transition-colors">
              Start your journey
              <ArrowDown className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


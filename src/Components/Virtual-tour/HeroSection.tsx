"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { styles } from "../../constants/styles"
import img1 from "../../assets/headset.png"

export function HeroSection() {
  const buttonVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.5 },
    },
  }

  return (
    <section className="w-full bg-white relative">
      <div className={styles.section.container}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 pb-12">
          <div className="max-w-xl flex flex-col items-center md:items-start">
            <h1 className="space-y-4 text-center md:text-left">
              <span className="block text-[8.6rem] leading-[1] font-light text-[#1A2E0D]">
                Visit
                <br />
                Plateau
              </span>
              <span className="block text-[8.2rem] leading-[1] font-bold text-[#1A2E0D]">at Home.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mb-6 mt-4 text-center md:text-left">
              Discover Plateau State's natural beauty, culture, and adventure without stepping outside.
            </p>
            <motion.div className="w-full" variants={buttonVariants} initial="initial" animate="animate">
              <button className="flex flex-row justify-center items-center px-6 py-2 gap-2 absolute w-[280px] h-[42px] left-[calc(50%-333px/2+26.5px)] top-[550px] bg-[#5A8E00] rounded-[40px] text-white hover:bg-[#4A7D00] transition-colors whitespace-nowrap">
                Start your Virtual Tour
                <ArrowDown className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
          <div className="flex justify-center items-center mt-32 md:mt-0">
            <img src={img1 || "/placeholder.svg"} alt="Person wearing VR headset" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}


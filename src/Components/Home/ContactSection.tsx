"use client"

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { motion, useInView, Variants } from "framer-motion"
import { styles } from "../../constants/styles"
import headphone from "../../assets/headphone_icon.png"
import question from "../../assets/help_icon.png"
import newhoverstateicon1 from "../../assets/newhoverstateicon1.png"
import newhoverstateicon2 from "../../assets/newhoverstateicon2.png"

export function ContactSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const boxHoverVariants: Variants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  }



  return (
    <section ref={sectionRef} className="w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Full width green background */}
      <motion.a
        href="mailto:Support@Experienceplateau.com"
        className="w-full md:w-1/2 bg-[#5A8E00] cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        whileHover="hover"
        variants={boxHoverVariants}
      >
        <div className={`${styles.section.container} group-hover:bg-white transition-colors duration-300`}>
          <motion.div
            className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-24 h-full flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex-1">
              <motion.div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-4" variants={itemVariants}>
                <img
                  src={headphone || "/placeholder.svg"}
                  alt="Headphone icon"
                  className="absolute inset-0 w-full h-full transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={newhoverstateicon1 || "/placeholder.svg"}
                  alt="Hover state icon"
                  className="absolute inset-0 w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </motion.div>
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl text-black mb-4 font-semibold group-hover:text-[#5A8E00] transition-colors duration-300"
                variants={itemVariants}
              >
                Call or email for assistance
              </motion.h2>
              <motion.p
                className="text-black/80 text-sm sm:text-base md:text-md max-w-md font-normal group-hover:text-[#5A8E00] transition-colors duration-300"
                variants={itemVariants}
              >
                Give us a call or send us an email to get a response to your questions right away!
              </motion.p>
            </div>
            <motion.span
              className="inline-flex font-semibold items-center text-black group-hover:text-[#5A8E00] transition-colors duration-300 text-base sm:text-lg md:text-xl mt-6 sm:mt-8 md:mt-12 lg:mt-40"
              variants={itemVariants}
            >
              Support@Experienceplateau.com
              <ArrowRight className="ml-2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" aria-hidden="true" />
            </motion.span>
          </motion.div>
        </div>
      </motion.a>

      {/* Right Side - Full width dark green background */}
      <motion.a
        href="/contact"
        className="w-full md:w-1/2 bg-[#141E03] cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        whileHover="hover"
        variants={boxHoverVariants}
      >
        <div className={`${styles.section.container} group-hover:bg-white transition-colors duration-300`}>
          <motion.div
            className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-24 h-full flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex-1">
              <motion.div
                className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-4 sm:mb-6"
                variants={itemVariants}
              >
                <img
                  src={question || "/placeholder.svg"}
                  alt="Question mark icon"
                  className="absolute inset-0 w-full h-full transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={newhoverstateicon2 || "/placeholder.svg"}
                  alt="Hover state icon"
                  className="absolute inset-0 w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </motion.div>
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl text-white mb-4 font-semibold group-hover:text-black transition-colors duration-300"
                variants={itemVariants}
              >
                Fill out our form or drop a feedback
              </motion.h2>
              <motion.p
                className="text-white/80 text-sm sm:text-base md:text-md max-w-md font-normal group-hover:text-black transition-colors duration-300"
                variants={itemVariants}
              >
                Do you want to send us a suggestion or complain about any of our services? Please send us your input to
                help us deliver better services.
              </motion.p>
            </div>
            <motion.span
              className="inline-flex font-semibold items-center text-white group-hover:text-black transition-colors duration-300 text-base sm:text-lg md:text-xl mt-6 sm:mt-8 md:mt-12 lg:mt-24"
              variants={itemVariants}
            >
              Fill out the form
              <ArrowRight className="ml-2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" aria-hidden="true" />
            </motion.span>
          </motion.div>
        </div>
      </motion.a>
    </section>
  )
}


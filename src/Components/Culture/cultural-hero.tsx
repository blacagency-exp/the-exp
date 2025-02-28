"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/culture.png"

export function CulturalHero() {
  return (
    <section className="bg-[#F5FFEB] py-12 sm:py-16 md:py-24">
      <div className={`${styles.section.container} px-4 sm:px-6 md:px-8`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-[#1B2E02] leading-tight"
          >
            Culture & Heritage
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <img
              src={img1 || "/placeholder.svg"}
              alt="Traditional cultural performance showing dancers and musicians"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#1B2E02] text-sm sm:text-base md:text-md leading-relaxed sm:leading-loose md:leading-10 max-w-7xl"
          >
            Plateau State is a rich cultural hub, home to over 40 ethnic groups, each with distinct traditions,
            languages, and histories. Visitors can delve into its heritage by exploring the ancient Nok culture, which
            dates back to 500 BC, and learning about the unique crafts, cuisines, and architectural styles of
            communities like the Berom, Tarok, and Ngas. Sites such as the Riyom Rock Formation and various tribal
            landmarks narrate stories of resilience and artistry deeply rooted in Plateau's history.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}


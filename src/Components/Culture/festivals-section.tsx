"use client"

import { motion } from "framer-motion"
import { styles } from "../../constants/styles"
import img1 from "../../assets/firstone.png"
import img2 from "../../assets/secondone.png"
import img3 from "../../assets/thirdone.png"

const festivals = [
  {
    id: 1,
    name: "Nzem Berom Festival",
    description:
      "This festival is a central cultural celebration for the Berom people, often held in April. It unifies various Berom communities and features traditional dances, storytelling, and displays of local crafts. The festival also honors the community's agrarian roots with rituals related to harvest and soil.",
    imagePosition: "left",
    image: img1,
  },
  {
    id: 2,
    name: "Pusdung Festival",
    description:
      "Celebrated by the Ngas people, this festival shows their cultural devotion to unity and peace. It features traditional music, dance, rituals, and exhibitions of local crafts. Evolving but steadfast in principle, these long-standing festivities focused on education, youth empowerment, and cultural preservation.",
    imagePosition: "right",
    image: img2,
  },
  {
    id: 3,
    name: "Afizere Cultural Festival",
    description:
      "This festival is a central cultural celebration for the Berom people, often held in April. It unifies various Berom communities and features traditional dances, storytelling, and displays of local crafts. The festival also honors the community's agrarian roots with rituals related to harvest and soil.",
    imagePosition: "left",
    image: img3,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function FestivalsSection() {
  return (
    <section className="py-24 bg-[#0A1400]">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-16 text-center"
        >
          Festivals & Events
        </motion.h2>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-24">
          {festivals.map((festival) => (
            <motion.div
              key={festival.id}
              variants={itemVariants}
              className={`flex flex-col ${
                festival.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 md:gap-16`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative w-full" style={{ paddingBottom: "60%" }}>
                  <div
                    className="absolute  overflow-hidden"
                    
                  >
                    <img
                      src={festival.image || "/placeholder.svg"}
                      alt={festival.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-[#9FE870] text-2xl font-semibold">{festival.name}</h3>
                <p className="text-white/80 leading-relaxed">{festival.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


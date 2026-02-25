"use client"

import { motion, Variants } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { styles } from "../../constants/styles"
import img1 from "../../assets/firstone.png"
import img2 from "../../assets/secondone.png"
import img3 from "../../assets/thirdone.png"
import img4 from "../../assets/ff1.png"

const festivals = [
  {
    id: 4,
    name: "Art Meets Fashion Festival",
    description:
      "Art Meets Fashion held at the prestigious yaradua center in abuja and headline by the guodo material is testiment of the treasurs in northan nigeria and plateau state",
    imagePosition: "left",
    image: img4,
  },
  {
    id: 1,
    name: "Nzem Berom Festival",
    description:
      "This festival is a central cultural celebration for the Berom people, often held in April. It unifies various Berom communities and features traditional dances, storytelling, and displays of local crafts. The festival also honors the community's agrarian roots with rituals related to harvest and soil.",
    imagePosition: "right",
    image: img1,
  },
  {
    id: 2,
    name: "Pusdung Festival",
    description:
      "Celebrated by the Ngas people, this festival shows their cultural devotion to unity and peace. It features traditional music, dance, rituals, and exhibitions of local crafts. Evolving but steadfast in principle, these long-standing festivities focused on education, youth empowerment, and cultural preservation.",
    imagePosition: "left",
    image: img2,
  },
  {
    id: 3,
    name: "Afizere Cultural Festival",
    description:
      "This festival is a central cultural celebration for the Berom people, often held in April. It unifies various Berom communities and features traditional dances, storytelling, and displays of local crafts. The festival also honors the community's agrarian roots with rituals related to harvest and soil.",
    imagePosition: "right",
    image: img3,
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
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
  const navigate = useNavigate()

  const handleFestivalClick = (festivalId: number) => {
    // Navigate to gallery page when first festival (id: 4) is clicked
    // or when entire row is clicked for any festival
    if (festivalId === 4) {
      navigate("/gallery")
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#0A1400]">
      <div className={`${styles.section.container} px-4 sm:px-6 md:px-8`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12 md:mb-16 text-center"
        >
          Festivals & Events
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 sm:space-y-16 md:space-y-24"
        >
          {festivals.map((festival) => (
            <motion.div
              key={festival.id}
              variants={itemVariants}
              onClick={() => handleFestivalClick(festival.id)}
              className={`flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-16 ${festival.imagePosition === "right" ? "md:flex-row-reverse" : ""
                } ${festival.id === 4 ? "cursor-pointer" : ""} group`}
              whileHover={festival.id === 4 ? { scale: 1.02 } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full md:w-1/2">
                <div className="relative w-full" style={{ paddingBottom: "60%" }}>
                  <div className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
                    <img
                      src={festival.image || "/placeholder.svg"}
                      alt={festival.name}
                      className={`w-full h-full object-cover md:p-8 transition-transform duration-500 ${festival.id === 4 ? "group-hover:scale-105" : ""
                        }`}
                    />
                    {festival.id === 4 && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Gallery →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-3 sm:space-y-4 md:p-12">
                <h3
                  className={`text-xl sm:text-2xl font-semibold transition-colors duration-300 ${festival.id === 4 ? "text-[#97E12B] group-hover:text-white" : "text-[#97E12B]"
                    }`}
                >
                  {festival.name}
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{festival.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { styles } from "../../constants/styles"
import img1 from '../../assets/dommun.png'
import img2 from '../../assets/jid.png'
import img3 from '../../assets/yakubu.png'
import img4 from '../../assets/uche.png'
import img5 from '../../assets/tor.png'
const guides = [
  {
    id: 1,
    name: "Danjuma Madaki",
    specialty: "Wildlife tours and eco-trail guiding",
    languages: "English, Hausa",
    rating: 5,
    image: img1,
  },
  {
    id: 2,
    name: "Jidangtok Ephraim Philemon",
    specialty: "Cultural heritage tours, traditional crafts",
    languages: "English, Hausa",
    rating: 5,
    image: img2,
  },
  {
    id: 3,
    name: "Yakubu Danlaye",
    specialty: "Wildlife tours and eco-trail guiding",
    languages: "English, Yoruba, Igbo, Hausa",
    rating: 5,
    reviews: 100,
    image: img3,
  },
  {
    id: 4,
    name: "Sunday Ocha",
    specialty: "Cultural heritage tours, traditional crafts",
    languages: "English, Hausa",
    rating: 5,
    image: img4,
  },
  {
    id: 5,
    name: "Masephina Tor",
    specialty: "Local cuisine experiences",
    languages: "English, Hausa",
    rating: 5,
    image: img5,
  },
  {
    id: 6,
    name: "Yakubu Danlaye",
    specialty: "Wildlife tours and eco-trail guiding",
    languages: "English, Yoruba, Igbo, Hausa",
    rating: 5,
    reviews: 100,
    image: img3,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function MeetGuides() {
  return (
    <section className="bg-[#1B2E02] py-24">
      <div className={`${styles.section.container}`}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#97E12B] text-4xl font-bold mb-12"
        >
          Meet your guides
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {guides.map((guide) => (
            <motion.div
              key={guide.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[#5A8E00] rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/4] overflow-hidden">
                <img src={guide.image || "/placeholder.svg"} alt={guide.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-black text-lg font-medium mb-1">{guide.name}</h3>
                <div className="space-y-2">
                  <p className="text-[#E8FFCC] text-sm font-extralight">My Specialty: {guide.specialty}</p>
                  <p className="text-[#E8FFCC] text-sm">I speak: {guide.languages}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: guide.rating }).map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-[#97E12B] text-[#97E12B]" />
                    ))}
                    {guide.reviews && <span className="text-[#E8FFCC] text-sm ml-1">({guide.reviews})</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


"use client"

import { useState, useCallback } from "react"
import { ArrowDown, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { styles } from "../../constants/styles"
import { ExperienceGrid } from "./ExperienceGrid"
import React from "react"

// Import images
import josWildlifeParkImg from "../../assets/wildlife.jpg"
import img1 from "../../assets/rock.jpg"
import img2 from "../../assets/stadium.jpg"
import img3 from "../../assets/riyom.jpg"
import img4 from "../../assets/wase_rock.jpg"

interface Place {
  id: number
  name: string
  image: string
  description: string
}

const places: Place[] = [
  {
    id: 1,
    name: "Jos Wildlife Park",
    image: josWildlifeParkImg,
    description:
      "A top wildlife conservation area home to lions, elephants, and baboons. It offers scenic nature walks, picnic spots, and a serene environment for visitors",
  },
  {
    id: 2,
    name: "Shere Hills",
    image: img1,
    description:
      "A top hiking and rock-climbing destination with panoramic views. Its rugged terrain also serves as a military training ground",
  },
  {
    id: 3,
    name: "Jos Stadium",
    image: img2,
    description:
      "A modern sports complex hosting football matches and athletic events, serving as the home ground of Plateau United FC",
  },
  {
    id: 4,
    name: "Riyom Rock",
    image: img3,
    description:
      " A stunning rock formation with giant boulders stacked in perfect balance, making it a great spot for sightseeing and photography",
  },
  {
    id: 5,
    name: "Wase Rock",
    image: img4,
    description:
      "A towering 350-meter inselberg and a rare bird sanctuary, home to the Rossy White Pelican, attracting nature lovers and birdwatchers",
  },
]

export function ExploreSection() {
  const [activePlace, setActivePlace] = useState(places[0])

  const changePlace = useCallback((place: Place) => {
    setActivePlace(place)
  }, [])

  return (
    <section className="w-full bg-[#141E03] text-white py-12 lg:py-24">
      <div className={styles.section.container}>
        <div className="space-y-4 lg:space-y-8 mb-8 lg:mb-16 text-center lg:text-left">
          <h2 className="text-[#97E12B] text-3xl uppercase tracking-wider lg:text-[5rem] lg:text-white lg:leading-none lg:tracking-tight lg:font-semibold lg:mb-16">
            Explore
          </h2>
          <div className="lg:flex lg:justify-between lg:items-center">
            <div className="space-y-1">
              <h3 className="text-4xl lg:text-5xl font-semibold">Places to visit</h3>
              <p className="text-[#97E12B] text-lg lg:text-xl font-normal">Dive into unforgettable experiences.</p>
            </div>
            <a href="#" className="hidden lg:block text-gray-400 hover:text-white underline font-normal">
              Is there more places you want to see?
            </a>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-24">
          <div className="hidden lg:block relative rounded-[2rem] overflow-hidden aspect-[4/4]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activePlace.id}
                src={activePlace.image || "/placeholder.svg"}
                alt={activePlace.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            {places.map((place) => (
              <React.Fragment key={place.id}>
                <motion.div
                  className={`w-full text-left transition-all duration-300 rounded-xl lg:rounded-[3rem] overflow-hidden 
                    ${
                      activePlace.id === place.id
                        ? "bg-white text-black"
                        : "bg-[#5A8E00] text-white hover:bg-[#5A8E00]/90"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => changePlace(place)}
                  onTouchStart={() => changePlace(place)}
                >
                  <div className="p-4 lg:p-8">
                    <div className="flex items-center space-x-4">
                      {activePlace.id === place.id ? (
                        <ArrowRight className="h-6 w-6 lg:hidden" />
                      ) : (
                        <ArrowDown className="h-6 w-6 lg:hidden" />
                      )}
                      <ArrowDown className="hidden lg:block h-6 w-6" />
                      <h4 className="text-xl lg:text-4xl font-medium">{place.name}</h4>
                    </div>
                    <AnimatePresence mode="wait">
                      {activePlace.id === place.id && (
                        <motion.p
                          key={place.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hidden lg:block text-gray-600 text-lg leading-relaxed font-regular mt-4"
                        >
                          {place.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                {activePlace.id === place.id && (
                  <div className="lg:hidden space-y-4">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activePlace.id}
                          src={activePlace.image || "/placeholder.svg"}
                          alt={activePlace.name}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                    </div>
                    <motion.p
                      key={`${activePlace.id}-description`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-sm leading-relaxed font-regular"
                    >
                      {activePlace.description}
                    </motion.p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <ExperienceGrid />
    </section>
  )
}


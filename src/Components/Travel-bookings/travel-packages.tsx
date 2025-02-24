"use client"

import type React from "react"
import { styles } from "@/constants/styles"
import img1 from "../../assets/discover.png"
import img2 from "../../assets/explorer.png"
import img3 from "../../assets/adventurer.png"
import { motion } from "framer-motion"

const packages = [
  {
    title: "Discoverer",
    image: img1,
    size: "w-full md:w-2/3 lg:w-1/2",
  },
  {
    title: "Explorer",
    image: img2,
    size: "w-full md:w-3/4 lg:w-2/3",
  },
  {
    title: "Adventurer",
    image: img3,
    size: "w-full md:w-5/6 lg:w-5/6",
  },
]

interface TravelPackagesProps {
  onPackageClick: (packageTitle: string) => void
}

export const TravelPackages: React.FC<TravelPackagesProps> = ({ onPackageClick }) => {
  return (
    <section className="py-24">
      <div className={styles.section.container}>
        <h2 className="text-5xl font-bold text-center mb-16">Travel Packages</h2>
        <div className="max-w-6xl mx-auto space-y-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white overflow-hidden flex justify-center"
            >
              <div
                className={`relative ${pkg.size} transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer`}
                onClick={() => onPackageClick(pkg.title)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onPackageClick(pkg.title)
                  }
                }}
                aria-label={`Book ${pkg.title} package`}
              >
                <img
                  src={pkg.image || "/placeholder.svg"}
                  alt={`${pkg.title} Package`}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0  p-4">
                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

